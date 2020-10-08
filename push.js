var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BOpPGzK7O5W5_JbAZrbYXym0WfNZ2AePNaZ0YxdRoTnYuxNTljyqLMhyg5VwAPW9X2W9q7Z9Evvbb5OWyVyOgc0",
    "privateKey": "f07bZbTsvV9h-RiSVdEmhd08gasHIwQ3D6Utnb-eKSU"
};


webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/cAuTvjLaNqk:APA91bGauH2zK65KnRASC4Q4hVgRyRHptx3AoGqIZZ1F4i4g74uIP2UlWV4iff9D3O7-p1cbEMlW4ItevzA5C8VYcvMRfNcXZByvyqxCdeXt-jdrbjjuZ2WqM6vEVJRTCkrCxr4yahl_",
    "keys": {
        "p256dh": "BO0amvNPIa5JYBf5zCXFV01ymqi9bONVzA4nJ5NWlCOpwV0MKWT6r6wJgV8dwK8OIGLVJZLisNPF9ue+7i/anl4=",
        "auth": "2pL4vnXKrg3VAGFcgtgpSA=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
    gcmAPIKey: '236641427506',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);