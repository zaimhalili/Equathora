import { supabase } from '../lib/supabaseClient';

/**
 * Diagnostic utility to check for duplicate problem completions
 * Run this from browser console to identify the 13/5 problem issue
 */
export async function checkForDuplicateCompletions() {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            console.log('❌ Not logged in');
            return { success: false, message: 'Not logged in' };
        }

        console.log('🔍 Checking for duplicate completions...');
        console.log('User ID:', session.user.id);

        // Get all completed problems for this user
        const { data: completions, error } = await supabase
            .from('user_completed_problems')
            .select('*')
            .eq('user_id', session.user.id)
            .order('completed_at', { ascending: true });

        if (error) {
            console.error('❌ Error:', error);
            return { success: false, error };
        }

        console.log(`\n📊 Total entries in database: ${completions.length}`);

        // Group by problem_id to find duplicates
        const problemCounts = {};
        const duplicates = [];

        completions.forEach(completion => {
            const pid = completion.problem_id;
            if (!problemCounts[pid]) {
                problemCounts[pid] = [];
            }
            problemCounts[pid].push(completion);
        });

        // Find duplicates
        Object.entries(problemCounts).forEach(([problemId, entries]) => {
            if (entries.length > 1) {
                duplicates.push({
                    problemId,
                    count: entries.length,
                    entries
                });
            }
        });

        // Calculate unique problems
        const uniqueProblemIds = Object.keys(problemCounts);
        console.log(`✅ Unique problems solved: ${uniqueProblemIds.length}`);

        if (duplicates.length > 0) {
            console.log(`\n⚠️  DUPLICATES FOUND (${duplicates.length} problems with duplicates):`);
            duplicates.forEach(dup => {
                console.log(`\nProblem ID: ${dup.problemId}`);
                console.log(`  Count: ${dup.count} duplicate entries`);
                console.log(`  Completion dates:`);
                dup.entries.forEach((entry, idx) => {
                    console.log(`    ${idx + 1}. ${entry.completed_at} (ID: ${entry.id})`);
                });
            });

            return {
                success: true,
                totalEntries: completions.length,
                uniqueProblems: uniqueProblemIds.length,
                duplicates,
                message: `Found ${duplicates.length} problems with duplicate entries`
            };
        } else {
            console.log('\n✅ No duplicates found!');
            return {
                success: true,
                totalEntries: completions.length,
                uniqueProblems: uniqueProblemIds.length,
                duplicates: [],
                message: 'No duplicates found'
            };
        }

    } catch (error) {
        console.error('❌ Error checking duplicates:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Remove duplicate entries, keeping only the FIRST completion for each problem
 * BE CAREFUL: This will delete data from the database!
 */
export async function removeDuplicateCompletions() {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            console.log('❌ Not logged in');
            return { success: false, message: 'Not logged in' };
        }

        // First check what duplicates exist
        const checkResult = await checkForDuplicateCompletions();

        if (!checkResult.success || checkResult.duplicates.length === 0) {
            console.log('✅ Nothing to remove');
            return { success: true, message: 'No duplicates to remove' };
        }

        console.log(`\n🗑️  Preparing to remove duplicates...`);
        console.log(`⚠️  This will delete ${checkResult.totalEntries - checkResult.uniqueProblems} entries`);

        const idsToDelete = [];

        // For each problem with duplicates, keep the FIRST entry, delete the rest
        checkResult.duplicates.forEach(dup => {
            // Sort by completed_at to ensure we keep the earliest
            const sorted = [...dup.entries].sort((a, b) =>
                new Date(a.completed_at) - new Date(b.completed_at)
            );

            // Keep first, delete rest
            for (let i = 1; i < sorted.length; i++) {
                idsToDelete.push(sorted[i].id);
                console.log(`  Will delete: Problem ${dup.problemId}, completed at ${sorted[i].completed_at}`);
            }
        });

        if (idsToDelete.length === 0) {
            console.log('✅ Nothing to delete');
            return { success: true, message: 'No duplicates to remove' };
        }

        console.log(`\n🚀 Deleting ${idsToDelete.length} duplicate entries...`);

        // Delete the duplicate entries
        const { error } = await supabase
            .from('user_completed_problems')
            .delete()
            .in('id', idsToDelete);

        if (error) {
            console.error('❌ Error deleting duplicates:', error);
            return { success: false, error };
        }

        console.log(`✅ Successfully removed ${idsToDelete.length} duplicate entries!`);
        console.log(`📊 You should now have ${checkResult.uniqueProblems} unique problems completed`);

        return {
            success: true,
            deleted: idsToDelete.length,
            remaining: checkResult.uniqueProblems,
            message: `Removed ${idsToDelete.length} duplicates`
        };

    } catch (error) {
        console.error('❌ Error removing duplicates:', error);
        return { success: false, error: error.message };
    }
}

// Make functions available in browser console
if (typeof window !== 'undefined') {
    window.checkForDuplicateCompletions = checkForDuplicateCompletions;
    window.removeDuplicateCompletions = removeDuplicateCompletions;
    console.log('🔧 Duplicate check utilities loaded!');
    console.log('Run: checkForDuplicateCompletions()');
    console.log('Then: removeDuplicateCompletions()');
}
