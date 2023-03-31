importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts(
	'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js'
);

firebase.initializeApp({
	apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
	authDomain: 'project-app-name.firebaseapp.com',
	databaseURL: 'https://project-app-name.firebaseio.com',
	projectId: 'project-app-name',
	storageBucket: 'project-app-name.appspot.com',
	messagingSenderId: 'xxxxxxxxxxxx',
	appId: '1:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxx',
	measurementId: 'xxxxxxxxxx',
});

const messaging = firebase?.messaging?.isSupported()
	? firebase.messaging()
	: null;
