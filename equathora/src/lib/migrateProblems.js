import { supabase } from './supabaseClient';
import { problems } from '../data/problems';

/**
 * One-time migration script to move problems from problems.js to database
 * Run this once from browser console or a temporary component
 */

export async function migrateProblemsToDatabase() {
    console.log('Starting problem migration...');
    
    try {
        // Step 1: Create problem groups
        const groupsMap = {};
        const uniqueGroups = [...new Set(problems.map(p => p.group))];
        
        for (let i = 0; i < uniqueGroups.length; i++) {
            const groupName = uniqueGroups[i];
            
            const { data, error } = await supabase
                .from('problem_groups')
                .insert({
                    name: groupName,
                    description: `${groupName} problems`,
                    display_order: i,
                    is_active: true
                })
                .select()
                .single();
            
            if (error) {
                console.error(`Error creating group ${groupName}:`, error);
                continue;
            }
            
            groupsMap[groupName] = data.id;
            console.log(`✓ Created group: ${groupName} (ID: ${data.id})`);
        }
        
        // Step 2: Insert all problems
        let successCount = 0;
        let errorCount = 0;
        
        for (const problem of problems) {
            const groupId = groupsMap[problem.group];
            
            if (!groupId) {
                console.error(`No group ID found for: ${problem.group}`);
                errorCount++;
                continue;
            }
            
            const { error } = await supabase
                .from('problems')
                .insert({
                    group_id: groupId,
                    title: problem.title,
                    difficulty: problem.difficulty,
                    description: problem.description,
                    answer: problem.answer,
                    accepted_answers: problem.acceptedAnswers || [problem.answer],
                    hints: problem.hints || [],
                    solution: problem.solution || '',
                    is_premium: problem.isPremium || false,
                    topic: problem.topic || problem.group,
                    display_order: problem.id,
                    is_active: true
                });
            
            if (error) {
                console.error(`Error inserting problem ${problem.id}:`, error);
                errorCount++;
            } else {
                successCount++;
                console.log(`✓ Migrated: ${problem.title}`);
            }
        }
        
        console.log('\n=== Migration Complete ===');
        console.log(`✓ Success: ${successCount} problems`);
        console.log(`✗ Errors: ${errorCount} problems`);
        console.log(`Total groups created: ${Object.keys(groupsMap).length}`);
        
        return {
            success: successCount,
            errors: errorCount,
            groups: Object.keys(groupsMap).length
        };
        
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
}

// Run migration from browser console:
// import { migrateProblemsToDatabase } from './lib/migrateProblems';
// migrateProblemsToDatabase();
