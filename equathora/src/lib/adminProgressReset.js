export const ADMIN_PROGRESS_RESET_CONFIRMATION = 'RESET PROGRESS';

export async function resetProgressCountersWithClient(client, userId, confirmation) {
    if (confirmation !== ADMIN_PROGRESS_RESET_CONFIRMATION) {
        throw new Error(`Type ${ADMIN_PROGRESS_RESET_CONFIRMATION} to reset progress counters.`);
    }

    const { error } = await client
        .from('user_progress')
        .update({
            total_attempts: 0,
            wrong_submissions: 0,
            correct_answers: 0
        })
        .eq('user_id', userId);

    if (error) {
        throw new Error(error.message || 'Failed to reset progress counters.');
    }
}
