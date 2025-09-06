import { browser } from '$app/environment';
import { PUBLIC_SPLENDOR_WS_PORT } from '$env/static/public';
import { app as wsApp } from '$backend/wss';

if (!browser) wsApp.listen(PUBLIC_SPLENDOR_WS_PORT);
