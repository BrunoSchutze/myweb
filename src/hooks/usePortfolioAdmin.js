// src/hooks/usePortfolioAdmin.js
import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function usePortfolioAdmin() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Obtener el ID del perfil
  const getProfileId = async () => {
    const { data, error } = await supabase
      .from('profile')
      .select('id')
      .limit(1)
      .single();
    
    if (error) throw error;
    return data.id;
  };

  // Actualizar Hero
  const updateHero = useCallback(async (hero) => {
    setSaving(true);
    try {
      const profileId = await getProfileId();
      const { error } = await supabase
        .from('profile')
        .update({
          hero_title: hero.title,
          hero_subtitle: hero.subtitle,
          hero_description: hero.description,
          hire_link: hero.hireLink,
          cv_url: hero.cvUrl,
          cv_file_name: hero.cvFileName,
        })
        .eq('id', profileId);
      
      if (error) throw error;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Actualizar About
  const updateAbout = useCallback(async (about) => {
    setSaving(true);
    try {
      const profileId = await getProfileId();

      // Actualizar info básica del perfil
      if (about.name !== undefined || about.description !== undefined) {
        await supabase
          .from('profile')
          .update({
            name: about.name,
            about_description: about.description,
          })
          .eq('id', profileId);
      }

      // Actualizar educación (múltiple)
      if (about.education) {
        // Eliminar educaciones existentes
        await supabase
          .from('education')
          .delete()
          .eq('profile_id', profileId);

        // Normalizar educación a array
        const educations = Array.isArray(about.education) 
          ? about.education 
          : [about.education];

        // Insertar nuevas educaciones
        if (educations.length > 0) {
          const educationsToInsert = educations.map((edu, index) => ({
            profile_id: profileId,
            institution: edu.institution || '',
            degree: edu.degree || '',
            status: edu.status || '',
            display_order: index,
            is_primary: index === 0, // La primera es la principal
          }));

          await supabase
            .from('education')
            .insert(educationsToInsert);
        }
      }

      // Actualizar experiencia
      if (about.experience) {
        const { data: existingExp } = await supabase
          .from('experience')
          .select('id')
          .eq('profile_id', profileId)
          .eq('is_primary', true)
          .single();

        if (existingExp) {
          await supabase
            .from('experience')
            .update({
              position: about.experience.position,
              company: about.experience.company,
              description: about.experience.description,
              period: about.experience.period,
            })
            .eq('id', existingExp.id);
        } else {
          await supabase
            .from('experience')
            .insert({
              profile_id: profileId,
              position: about.experience.position,
              company: about.experience.company,
              description: about.experience.description,
              period: about.experience.period,
              is_primary: true,
            });
        }
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Actualizar Skills
  const updateSkills = useCallback(async (skills) => {
    setSaving(true);
    try {
      const profileId = await getProfileId();

      // Eliminar skills existentes
      await supabase
        .from('skills')
        .delete()
        .eq('profile_id', profileId);

      // Insertar nuevos skills
      if (skills && skills.length > 0) {
        const { error } = await supabase
          .from('skills')
          .insert(
            skills.map((skill, index) => ({
              profile_id: profileId,
              name: typeof skill === 'string' ? skill : skill.name,
              certificate_url: typeof skill === 'string' ? null : (skill.certificate || null),
              display_order: index,
            }))
          );

        if (error) throw error;
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Actualizar Proyectos
  const updateProjects = useCallback(async (projects) => {
    setSaving(true);
    try {
      const profileId = await getProfileId();

      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const isUUID = project.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(project.id);

        if (isUUID) {
          // Actualizar proyecto existente
          await supabase
            .from('projects')
            .update({
              title: project.title,
              description: project.description,
              image_url: project.img,
              project_url: project.url,
              github_url: project.github,
              display_order: i,
            })
            .eq('id', project.id);

          // Actualizar tags
          await supabase.from('project_tags').delete().eq('project_id', project.id);
          
          if (project.tags && project.tags.length > 0) {
            for (const tagName of project.tags) {
              let { data: tag } = await supabase
                .from('tags')
                .select('id')
                .eq('name', tagName)
                .single();

              if (!tag) {
                const { data: newTag } = await supabase
                  .from('tags')
                  .insert({ name: tagName })
                  .select()
                  .single();
                tag = newTag;
              }

              if (tag) {
                await supabase.from('project_tags').insert({
                  project_id: project.id,
                  tag_id: tag.id,
                });
              }
            }
          }

          // Actualizar features
          await supabase.from('project_features').delete().eq('project_id', project.id);
          if (project.features && project.features.length > 0) {
            await supabase.from('project_features').insert(
              project.features.map((f, idx) => ({
                project_id: project.id,
                feature: f,
                display_order: idx,
              }))
            );
          }

          // Actualizar galería
          await supabase.from('project_images').delete().eq('project_id', project.id);
          if (project.images && project.images.length > 0) {
            await supabase.from('project_images').insert(
              project.images.map((img, idx) => ({
                project_id: project.id,
                image_url: img,
                display_order: idx,
              }))
            );
          }
        } else {
          // Crear nuevo proyecto
          const { data: newProject, error: insertError } = await supabase
            .from('projects')
            .insert({
              profile_id: profileId,
              title: project.title,
              description: project.description,
              image_url: project.img,
              project_url: project.url,
              github_url: project.github,
              display_order: i,
            })
            .select()
            .single();

          if (insertError) throw insertError;

          if (newProject && project.tags) {
            for (const tagName of project.tags) {
              let { data: tag } = await supabase
                .from('tags')
                .select('id')
                .eq('name', tagName)
                .single();

              if (!tag) {
                const { data: newTag } = await supabase
                  .from('tags')
                  .insert({ name: tagName })
                  .select()
                  .single();
                tag = newTag;
              }

              if (tag) {
                await supabase.from('project_tags').insert({
                  project_id: newProject.id,
                  tag_id: tag.id,
                });
              }
            }
          }

          if (newProject && project.features && project.features.length > 0) {
            await supabase.from('project_features').insert(
              project.features.map((f, idx) => ({
                project_id: newProject.id,
                feature: f,
                display_order: idx,
              }))
            );
          }

          if (newProject && project.images && project.images.length > 0) {
            await supabase.from('project_images').insert(
              project.images.map((img, idx) => ({
                project_id: newProject.id,
                image_url: img,
                display_order: idx,
              }))
            );
          }
        }
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Eliminar Proyecto
  const deleteProject = useCallback(async (projectId) => {
    setSaving(true);
    try {
      const { error } = await supabase.from('projects').delete().eq('id', projectId);
      if (error) throw error;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Actualizar Servicios
  const updateServices = useCallback(async (services) => {
    setSaving(true);
    try {
      const profileId = await getProfileId();

      for (let i = 0; i < services.length; i++) {
        const service = services[i];
        const isUUID = service.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(service.id);

        if (isUUID) {
          await supabase
            .from('services')
            .update({
              title: service.title,
              description: service.desc,
              icon: service.icon,
              display_order: i,
            })
            .eq('id', service.id);
        } else {
          await supabase
            .from('services')
            .insert({
              profile_id: profileId,
              title: service.title,
              description: service.desc,
              icon: service.icon,
              display_order: i,
            });
        }
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Eliminar Servicio
  const deleteService = useCallback(async (serviceId) => {
    setSaving(true);
    try {
      const { error } = await supabase.from('services').delete().eq('id', serviceId);
      if (error) throw error;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Subir imagen a Storage
  const uploadImage = useCallback(async (file, bucket = 'portfolio-images', folder = 'general') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }, []);

  // Guardar todo el contenido
  const saveAllContent = useCallback(async (content) => {
    setSaving(true);
    try {
      await updateHero(content.hero);
      await updateAbout(content.about);
      await updateSkills(content.about.skills);
      await updateProjects(content.projects);
      await updateServices(content.services);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [updateHero, updateAbout, updateSkills, updateProjects, updateServices]);

  return {
    saving,
    error,
    updateHero,
    updateAbout,
    updateSkills,
    updateProjects,
    deleteProject,
    updateServices,
    deleteService,
    uploadImage,
    saveAllContent,
  };
}