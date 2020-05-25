/** SOCKET **/
var socket = io('ws://localhost:8001', {
	transports: ['websocket']
});