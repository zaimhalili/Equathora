/**
 * OneSignal Service for Equathora
 * Handles push notifications, user identification, and segmentation
 */

const ONESIGNAL_APP_ID = '33aeba5a-e1a5-4f07-b6cc-9a25beb110c4';

// Initialize OneSignal
export async function initializeOneSignal() {
    if (typeof window === 'undefined') return;

    // Check if OneSignal is already loaded
    if (typeof OneSignal === 'undefined') {
        console.warn('OneSignal SDK not yet loaded. Will retry on next mount.');
        return;
    }

    try {
        // Initialize OneSignal
        OneSignal.init({
            appId: ONESIGNAL_APP_ID,
            allowLocalhostAsSecureOrigin: true,
        });

        // Set up event handlers
        setupEventHandlers();
    } catch (error) {
        console.error('Error initializing OneSignal:', error);
    }
}

function setupEventHandlers() {
    // Handle notification display
    OneSignal.on('notificationDisplay', onNotificationDisplay);

    // Handle notification click
    OneSignal.on('notificationClick', onNotificationClick);
}

function onNotificationDisplay(event) {
    console.log('OneSignal notification displayed:', event.notification);
}

function onNotificationClick(event) {
    const link = event.notification.data?.link || event.notification.launchURL;
    if (link) {
        window.location.href = link;
    }
}

// Request push notification permission
export async function requestPushPermission() {
    try {
        if (typeof OneSignal === 'undefined') {
            console.warn('OneSignal not loaded');
            return false;
        }

        const permission = await OneSignal.Notifications.requestPermission();
        return permission;
    } catch (error) {
        console.error('Error requesting push permission:', error);
        return false;
    }
}

// Get subscription status
export async function getPushSubscriptionStatus() {
    try {
        if (typeof OneSignal === 'undefined') return false;

        const subscription = await OneSignal.User.pushSubscription.id;
        return !!subscription;
    } catch (error) {
        console.error('Error getting subscription status:', error);
        return false;
    }
}

// Set user identification (email, phone, external ID)
export async function identifyUser({ userId, email, phone, properties = {} }) {
    try {
        if (typeof OneSignal === 'undefined') {
            console.warn('OneSignal not loaded');
            return false;
        }

        // Set external user ID for better tracking
        if (userId) {
            OneSignal.login(userId);
        }

        // Set email for email/SMS campaigns
        if (email) {
            await OneSignal.User.addEmail(email);
        }

        // Set phone for SMS campaigns (if available)
        if (phone) {
            await OneSignal.User.addSms(phone);
        }

        // Set custom properties for segmentation
        if (Object.keys(properties).length > 0) {
            await OneSignal.User.addProperties(properties);
        }

        return true;
    } catch (error) {
        console.error('Error identifying user:', error);
        return false;
    }
}

// Update user properties/tags for segmentation
export async function updateUserProperties(properties) {
    try {
        if (typeof OneSignal === 'undefined') return false;

        // properties: { streak_days: 5, level: 'intermediate', topics: 'algebra,geometry' }
        await OneSignal.User.addProperties(properties);
        return true;
    } catch (error) {
        console.error('Error updating user properties:', error);
        return false;
    }
}

// Log out user
export async function logoutOneSignalUser() {
    try {
        if (typeof OneSignal === 'undefined') return false;

        await OneSignal.logout();
        return true;
    } catch (error) {
        console.error('Error logging out OneSignal user:', error);
        return false;
    }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPush() {
    try {
        if (typeof OneSignal === 'undefined') return false;

        if (OneSignal.User?.pushSubscription?.id) {
            await OneSignal.User.pushSubscription.optOut();
        }
        return true;
    } catch (error) {
        console.error('Error unsubscribing from push:', error);
        return false;
    }
}

// Re-subscribe to push notifications
export async function resubscribeToPush() {
    try {
        if (typeof OneSignal === 'undefined') return false;

        if (OneSignal.User?.pushSubscription?.id) {
            await OneSignal.User.pushSubscription.optIn();
        }
        return true;
    } catch (error) {
        console.error('Error resubscribing to push:', error);
        return false;
    }
}

export { ONESIGNAL_APP_ID };
