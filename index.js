
/**
 * YOUR SENDBIRD INFO
 */
const APP_ID = 'YOUR-APP-ID-HERE';
const USER_ID = 'YOUR-USER-ID-HERE';
const ACCESS_TOKEN = null; // ENTER ACCESS TOKEN IF USER HAS ONE

/**
 *  Where group channels will be listed in your HTML
 */
const group_channels_list = document.getElementById('group_channels_list');

/**
 * INIT SENDBIRD
 */
var sb = new SendBird({appId: APP_ID});

/**
 * KEEP TRACK OF CONNECTED USER
 */
var connectedUser;

/**
 * CONNECT TO WEBSOCKET
 */
sb.connect(USER_ID, ACCESS_TOKEN, (user, error) => {
    connectedUser = user;
    if (error) {
        return;
    } else {
        getGroupChannels(() => {
            console.log('Group channels on screen');
        });
    }
});

/**
 * LIST ALL GROUP CHANNELS
 */
function getGroupChannels(callback) {
    var channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
    channelListQuery.includeEmpty = true;
    channelListQuery.order = 'latest_last_message';
    channelListQuery.limit = 100;

    // THIS WILL FILTER GROUP CHANNELS BY CUSTOM TYPE
    channelListQuery.customTypesFilter = ['VISIBLE'];

    if (channelListQuery.hasNext) {
        channelListQuery.next((groupChannels, error) => {
            console.dir(groupChannels);
            if (error) {
                return;
            } else {
                clearLeftColumen();
                for (const item of groupChannels) {
                    drawGroupChannel(item);
                }
                callback();
            }
        });
    }
}

/**
 * CLEAR LIST OF CHANNELS
 */
function clearLeftColumen() {
    group_channels_list.innerHTML = '<div class="list-group" id="channel_list"></div>';
}

/**
 * DRAW GROUP CHANNEL ON THE LEFT COLUMN
 */
function drawGroupChannel(channel) {
    document.getElementById('channel_list').innerHTML += `
        <a href="#" class="list-group-item list-group-item-action" id="channel-${ channel.url }" onclick="listMessagesFromChannel('${ channel.url }')">
            ${ channel.name }
        </a>
    `;
}

/**
 * https://sendbird.com/docs/chat/v3/javascript/guides/group-channel#1-group-channel
 */
function createGroupChannel() {
    /**
     * Channel name
     */
    const groupChannelName = document.getElementById('newGroupChannelName');
    /**
     * Is visible?
     */
    const newGroupChannelVisible = document.getElementById('newGroupChannelVisible').checked;
    
    const CUSTOM_TYPE = newGroupChannelVisible ? "VISIBLE" : "";
    
    /**
     * Create parameters 
     */    
    var params = new sb.GroupChannelParams();
    params.isPublic = true;
    params.isEphemeral = false;
    params.isDistinct = false;
    params.isSuper = false;
    params.addUserIds([USER_ID]);
    params.name = groupChannelName.value;
    params.customType = CUSTOM_TYPE;
    /**
     * Create group channel
     */
    sb.GroupChannel.createChannel(params, (groupChannel, error) => {
        if (error) {
            console.dir(error);
        } else {
            groupChannelName.value = '';
            reloadLeftList();
        }
    });
}

function reloadLeftList() {
    getGroupChannels(() => {
        console.log('Group channels on screen');
    });
}


