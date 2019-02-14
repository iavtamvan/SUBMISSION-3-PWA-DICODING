var webPush = require('web-push');
var pushSubscription = {
    "endpoint": "https://android.googleapis.com/gcm/send/eJEfcvJwm_s:APA91bFaLXv1X-ggdWEYmN4RBscUa2m1Y1WpCgsUJZ6M0SHyJbh04UYEx-Ybi-jyzxpvz_v4FL4AetiJkMPz9_7wKLFSI9utGExJtzftfqofdLD1llQ-D3vA10gjme7lU3ESBFos3sYi",
    "keys": {
        "p256dh": "BKqDexPwyQQmtQqL8wwmHV+nPWnZLuCOtTjxcpafEgDjcCkn74W3Xpng+bq94HHfMkb/crQR7WZy7t2t/H3kDOM=",
        "auth": "uYcCllFxKbVB46Tpjaxcvg=="
    }
};
var payload = 'Here is a payload!';
var options = {
    gcmAPIKey: '394791122916',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);
