import { browser } from '$app/environment';
import { SPLENDOR_WS_PORT } from '$env/static/public';
import { app as wsApp } from '$backend/wss';

if (!browser) wsApp.listen(SPLENDOR_WS_PORT);
