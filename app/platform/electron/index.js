
import fs from 'fs-extra';
import config from '../common/config'
import sound from '../common/sound'
import env from './env';
import screenshot from './screenshot';
import contextmenu from './contextmenu';
import remote from './remote';
import EventEmitter from './event-emitter';
import image from './image';
import ui from './ui';
import notify from './notify';
import shortcut from './shortcut';
import dialog from './dialog';
import net from './net';
import crypto from './crypto';
import Socket from './socket';

if(process.type !== 'renderer') {
    throw new Error('platform/electron/index.js must run in renderer process.');
}

const platform = {
    type: 'electron',
    env,
    screenshot,
    contextmenu,
    EventEmitter,
    remote,
    image,
    ui,
    dialog,
    fs,
    config,
    sound,
    net,
    crypto,
    Socket
};

if(DEBUG) {
    global.$.Platform = platform;
}

export default platform;
