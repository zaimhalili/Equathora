
import { supabase } from './supabaseClient.js';


export const getFriends =  async function getFriends(
    profileId, 
    page = null,
    pageSize = null 
) {
      try {
          const from = (page - 1) * pageSize;
          const to = from + pageSize - 1;

          const { data, count, error } = await supabase
              .from('user_friends')
              .select('*', { count: 'exact' })
              .eq('is_active', true)
              .order('display_order', { ascending: true })
              .where('profile_id', profileId)
              .range(from, to);
  
          if (error) throw error;
      } catch (error) {
          console.error('Error fetching friends:', error);
          return [];
      }
    }

export async function addFriend(friendId,profileId) {
      try {
          const { data, error } = await supabase
              .from('user_friends')
              .insert({
                  profile_id: profileId,
                  friend_id: friendId,  
              });
  
          if (error) throw error;
          
      } catch (error) {
          console.error('Error adding friend:', error);
          return [];
      }
    }

export async function removeFriend(friendId, profileId) {
      try {
          const { error } = await supabase
              .from('user_friends')
              .delete()
              .eq('profile_id', profileId)
              .eq('friend_id', friendId);
  
          if (error) throw error;
          
      } catch (error) {
          console.error('Error removing friend:', error);
          return [];
      }
}




