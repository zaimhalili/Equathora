// ============================================================================
// EQUATHORA ADMIN CONSOLE HELPER
// Copy and paste this entire file into the browser console for quick admin tasks
// ⚠️ SECURITY: Only works if you have admin role in the database
// ============================================================================

// Make notification functions globally available
window.EquathoraAdmin = {
  
  // Check if you're an admin
  async checkAdmin() {
    const { isCurrentUserAdmin } = await import('./src/lib/notificationService');
    const isAdmin = await isCurrentUserAdmin();
    
    if (isAdmin) {
      console.log('%c✅ You are an admin!', 'color: green; font-weight: bold; font-size: 16px;');
      console.log('You can use all admin commands.');
    } else {
      console.log('%c❌ You are NOT an admin', 'color: red; font-weight: bold; font-size: 16px;');
      console.log('Ask a current admin to run this SQL in Supabase:');
      const { supabase } = await import('./src/lib/supabaseClient');
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log(`%cUPDATE profiles SET role = 'admin' WHERE id = '${session.user.id}';`, 'background: #f0f0f0; padding: 10px; font-family: monospace;');
      }
    }
    
    return isAdmin;
  },

  // Send announcement to all users (ADMIN ONLY)
  async sendAnnouncement(title, message, link = '/systemupdates') {
    console.log('🔒 Checking admin permissions...');
    const { notifySystemAnnouncement } = await import('./src/lib/notificationService');
    const result = await notifySystemAnnouncement(title, message, link);
    
    if (result.success) {
      console.log('%c✅ Announcement sent successfully!', 'color: green; font-weight: bold;');
      console.log(result);
    } else {
      console.log('%c❌ Failed to send announcement', 'color: red; font-weight: bold;');
      console.log(result.message);
    }
    
    return result;
  },

  // Send custom notification to all users (ADMIN ONLY)
  async sendToAll({ type, title, message, link }) {
    console.log('🔒 Checking admin permissions...');
    const { notifyAllUsers } = await import('./src/lib/notificationService');
    const result = await notifyAllUsers({ type, title, message, link });
    
    if (result.success) {
      console.log('%c✅ Notification sent successfully!', 'color: green; font-weight: bold;');
      console.log(result);
    } else {
      console.log('%c❌ Failed to send notification', 'color: red; font-weight: bold;');
      console.log(result.message);
    }
    
    return result;
  },

  // Check how many users will receive notifications
  async getUserCount() {
    const { supabase } = await import('./src/lib/supabaseClient');
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Error:', error);
      return 0;
    }
    console.log(`👥 Total users: ${count}`);
    return count;
  },

  // Check recent notifications
  async getRecentNotifications(limit = 10) {
    const { supabase } = await import('./src/lib/supabaseClient');
    const { data, error } = await supabase
      .from('user_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('❌ Error:', error);
      return [];
    }
    console.table(data);
    return data;
  },

  // Test welcome notification for current user
  async testWelcome() {
    const { notifyWelcome } = await import('./src/lib/notificationService');
    const { supabase } = await import('./src/lib/supabaseClient');
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('❌ Not logged in');
      return;
    }
    
    const username = session.user.user_metadata?.username || 
                    session.user.user_metadata?.full_name || 
                    'Friend';
    
    const result = await notifyWelcome(username);
    console.log('✅ Welcome notification sent to yourself:', result);
    return result;
  },

  // Help message
  help() {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║           EQUATHORA ADMIN CONSOLE HELPER                       ║
║           🔒 SECURE - REQUIRES ADMIN ROLE                      ║
╚════════════════════════════════════════════════════════════════╝

Available commands:

0️⃣  EquathoraAdmin.checkAdmin()
   → Check if you have admin permissions

1️⃣  EquathoraAdmin.getUserCount()
   → Check how many users will receive notifications

2️⃣  EquathoraAdmin.testWelcome()
   → Send yourself a test welcome notification

3️⃣  EquathoraAdmin.sendAnnouncement(title, message, link)
   → Send announcement to ALL users (ADMIN ONLY)
   
   Example:
   await EquathoraAdmin.sendAnnouncement(
     'New Feature: Dark Mode',
     'Check it out in your settings!',
     '/settings'
   );

4️⃣  EquathoraAdmin.sendToAll({ type, title, message, link })
   → Send custom notification to ALL users (ADMIN ONLY)
   
   Example:
   await EquathoraAdmin.sendToAll({
     type: 'system',
     title: 'Platform Update',
     message: 'New features available!',
     link: '/dashboard'
   });

5️⃣  EquathoraAdmin.getRecentNotifications(10)
   → View recent notifications

6️⃣  EquathoraAdmin.help()
   → Show this help message

Notification types: 'system', 'achievement', 'streak', 'friend', 'problem', 'leaderboard'

⚠️  SECURITY NOTES:
    • Only users with role='admin' in the database can send to all users
    • Admin status is verified at BOTH frontend and database level (RLS)
    • Regular users will get "Access denied" error if they try
    • Run checkAdmin() first to verify your permissions

💡 First time? Run: EquathoraAdmin.checkAdmin()
    `);
  }
};

// Auto-run help on load
console.log('%c Welcome to Equathora Admin Console! ', 'background: #d90429; color: white; font-size: 16px; padding: 10px;');
console.log('%c 🔒 SECURE MODE: Admin verification enabled ', 'background: #4CAF50; color: white; font-size: 14px; padding: 5px;');
console.log('%c Type EquathoraAdmin.checkAdmin() to verify your permissions', 'color: #d90429; font-size: 14px;');
console.log('%c Then type EquathoraAdmin.help() for all commands', 'color: #666; font-size: 12px;');

// Quick access aliases
window.eq = window.EquathoraAdmin;
console.log('%c Pro tip: Use "eq" as shorthand (e.g., eq.checkAdmin())', 'color: #666; font-style: italic;');
