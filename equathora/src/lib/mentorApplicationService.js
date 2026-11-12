import { supabase } from './supabaseClient';

const FRIENDLY_ERROR = 'We could not submit your application right now. Please try again.';

export async function submitMentorApplication(application) {
    const payload = {
        user_id: application.userId,
        full_name: application.fullName.trim(),
        email: application.email.trim().toLowerCase(),
        role: application.role,
        phone: application.phone.trim(),
        has_whatsapp: application.hasWhatsapp === 'Yes',
        subjects: application.subjects,
        teaching_experience: application.experience,
        platforms: application.platforms,
        school_lms: application.schoolLms,
        interested_features: application.interestedFeatures,
        additional_notes: application.additionalNotes.trim()
    };

    const { error } = await supabase
        .from('mentor_applications')
        .insert(payload);

    if (error) {
        if (error.code === '23505') {
            throw new Error('You have already submitted an application.');
        }

        console.error('Unable to submit mentor application:', error);
        throw new Error(FRIENDLY_ERROR);
    }
}
