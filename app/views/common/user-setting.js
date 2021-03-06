import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import HTML from '../../utils/html-helper';
import Icon from '../../components/icon';
import HotkeyInputControl from '../../components/hotkey-input-control';
import Lang from '../../lang';
import Config from 'Config';
import Platform from 'Platform';
import Checkbox from '../../components/checkbox';
import SelectBox from '../../components/select-box';

const isNotificationOff = state => {
    return !state['ui.notify.enableSound'];
};
const isFlashTrayIconOff = state => {
    return !Platform.env.isWindowsOS || !state['ui.notify.flashTrayIcon'];
};
const configs = [
    {
        name: 'chats',
        title: Lang.string('setting.section.chats'),
        items: [
            {
                type: 'boolean',
                name: 'ui.chat.menu.showMe',
                caption: Lang.string('setting.chats.showMeOnMenu')
            }, {
                type: 'boolean',
                name: 'ui.chat.sendHDEmoticon',
                caption: Lang.string('setting.chats.sendHDEmoticon')
            }, {
                type: 'boolean',
                name: 'ui.chat.showMessageTip',
                caption: Lang.string('setting.chats.showMessageTip')
            }, {
                type: 'boolean',
                name: 'ui.chat.enableSearchInEmojionePicker',
                caption: Lang.string('setting.chats.enableSearchInEmojionePicker')
            }, {
                type: 'boolean',
                name: 'ui.chat.enableAnimate',
                caption: Lang.string('setting.chats.enableAnimate')
            }
        ]
    }, {
        name: 'notification',
        title: Lang.string('setting.section.notification'),
        items: [
            {
                type: 'boolean',
                name: 'ui.notify.enableSound',
                caption: Lang.string('setting.notification.enableSoundNotification')
            }, {
                type: 'select',
                name: 'ui.notify.playSoundCondition',
                className: 'level-2',
                options: [
                    {value: '', label: Lang.string('setting.notification.playSountOnNeed')},
                    {value: 'onWindowBlur', label: Lang.string('setting.notification.playSountOnWindowBlur')},
                    {value: 'onWindowHide', label: Lang.string('setting.notification.playSountOnWindowHide')},
                ],
                hidden: isNotificationOff,
                caption: Lang.string('setting.notification.playSoundCondition')
            }, {
                type: 'boolean',
                className: 'level-2',
                name: 'ui.notify.muteOnUserIsBusy',
                hidden: isNotificationOff,
                caption: Lang.string('setting.notification.muteOnUserIsBusy')
            }, {
                type: 'boolean',
                name: 'ui.notify.flashTrayIcon',
                hidden: !Platform.env.isWindowsOS,
                caption: Lang.string('setting.notification.flashTrayIcon')
            }, {
                type: 'select',
                name: 'ui.notify.flashTrayIconCondition',
                className: 'level-2',
                options: [
                    {value: '', label: Lang.string('setting.notification.playSountOnNeed')},
                    {value: 'onWindowBlur', label: Lang.string('setting.notification.playSountOnWindowBlur')},
                    {value: 'onWindowHide', label: Lang.string('setting.notification.playSountOnWindowHide')},
                ],
                hidden: isFlashTrayIconOff,
                caption: Lang.string('setting.notification.flashTrayIconCondition')
            }
        ]
    }, {
        name: 'navigation',
        title: Lang.string('setting.section.navigation'),
        items: [
            {
                type: 'boolean',
                name: 'ui.navbar.avatarPosition',
                caption: Lang.string('setting.navigation.showAvatarOnBottom'),
                getConverter: value => {
                    return value === 'bottom';
                },
                setConverter: value => {
                    return value ? 'bottom' : 'top'
                },
            }
        ]
    }, {
        name: 'windows',
        title: Lang.string('setting.section.windows'),
        items: [
            {
                type: 'boolean',
                name: 'ui.app.hideWindowOnBlur',
                caption: Lang.string('setting.windows.hideWindowOnBlur')
            }, {
                type: 'boolean',
                name: 'ui.app.removeFromTaskbarOnHide',
                caption: Lang.string('setting.windows.removeFromTaskbarOnHide')
            }, {
                type: 'select',
                name: 'ui.app.onClickCloseButton',
                options: [
                    {value: 'ask', label: Lang.string('setting.windows.askEveryTime')},
                    {value: 'minimize', label: Lang.string('setting.windows.minimizeMainWindow')},
                    {value: 'close', label: Lang.string('setting.windows.quitApp')},
                ],
                caption: Lang.string('setting.notification.flashTrayIconCondition')
            }
        ]
    }, {
        name: 'hotkeys',
        title: Lang.string('setting.section.hotkeys'),
        items: [
            {
                type: 'hotkey',
                name: 'shortcut.captureScreen',
                caption: Lang.string('setting.hotkeys.globalCaptureScreen')
            }
        ]
    }
]

class UserSetting extends Component {

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props.settings);
    }

    getSettings() {
        return this.state;
    }

    setSettings(settings) {
        this.setState(Object.assign({}, settings));
    }

    changeConfig(item, value) {
        const name = item.name;
        if(typeof value === 'object' && value.target) {
            if(value.target.type === 'checkbox') {
                value = value.target.checked;
            } else {
                value = value.target.value;
            }
        }
        if(item.setConverter) {
            value = item.setConverter(value);
        }
        this.setState({[name]: value});
    }

    renderConfigItem(item) {
        if(item.hidden) {
            let hidden = item.hidden;
            if(typeof item.hidden === 'function') {
                hidden = item.hidden(this.state);
            }
            if(hidden) {
                return null;
            }
        }
        switch(item.type) {
            case 'boolean':
                return this.renderBooleanItem(item);
            case 'select':
                return this.renderSelectItem(item);
            case 'hotkey':
                return this.renderHotkeyItem(item);
        }
        return null;
    }

    renderHotkeyItem(item) {
        let value = this.state[item.name];
        if(item.getConverter) {
            value = item.getConverter(value);
        }
        return <HotkeyInputControl key={item.name} defaultValue={value} labelStyle={{flex: 1}} onChange={this.changeConfig.bind(this, item)} label={item.caption} className={HTML.classes("flex", item.className)}/>
    }

    renderSelectItem(item) {
        let value = this.state[item.name];
        if(item.getConverter) {
            value = item.getConverter(value);
        }
        return <div className={HTML.classes("control flex", item.className)} key={item.name}>
            <div>{item.caption}</div>
            <SelectBox options={item.options} onChange={this.changeConfig.bind(this, item)} selectClassName="rounded"/>
        </div>;
    }

    renderBooleanItem(item) {
        let value = this.state[item.name];
        if(item.getConverter) {
            value = item.getConverter(value);
        }
        const checked = !!value;
        return <div className={HTML.classes("control", item.className)} key={item.name}>
            <Checkbox checked={checked} label={item.caption} onChange={this.changeConfig.bind(this, item)}/>
        </div>;
    }

    render() {
        let {
            settings,
            className,
            children,
            ...other
        } = this.props;

        return <div {...other}
            className={HTML.classes('app-user-setting space', className)}
        >
            {
                configs.map(section => {
                    if(section.hidden) {
                        return null;
                    }
                    return <section key={section.name} className="space">
                        <header className="heading divider space-sm">
                            <strong className="title text-gray">{section.title}</strong>
                        </header>
                        <div className="items">
                        {
                            section.items.map(item => {
                                return this.renderConfigItem(item);

                            })
                        }
                        </div>
                    </section>
                })
            }
            {children}
        </div>;
    }
}

export default UserSetting;
