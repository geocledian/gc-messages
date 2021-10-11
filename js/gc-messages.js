/*
 Vue.js Geocledian messages component
 created: 2021-09-21, jsommer
 updated: 2021-09-21, jsommer
 version: 0.1
*/
"use strict";

//language strings
const gcMessagesLocales = {
  "en": {
    "options": { "title": "Messages" },
    "table": { 
      "header": { 
        "timestamp": "Time",
        "code": "Code",
        "description": "Description",
        "content": "Content",
        "priority": "Priority",
      },
      "nodata": "Sorry, no messages available!"
    },
  },
  "de": {
    "options": { "title": "Ereignisse" },
    "table": { 
      "header": { 
        "timestamp": "Zeit",
        "code": "Code",
        "description": "Beschreibung",
        "content": "Inhalt",
        "priority": "Priorität",
      },
      "nodata": "Leider keine Ereignisse vorhanden!"
    },
  },
}

Vue.component('gc-messages', {
  props: {
    gcWidgetId: {
      type: String,
      default: 'messages1',
      required: true
    },
    gcApikey: {
      type: String,
      default: '39553fb7-7f6f-4945-9b84-a4c8745bdbec'
    },
    gcHost: {
      type: String,
      default: 'geocledian.com'
    },
    gcProxy: {
      type: String,
      default: undefined
    },
    gcApiBaseUrl: {
      type: String,
      default: "/agknow/api/v4"
    },
    gcApiSecure: {
      type: Boolean,
      default: true
    },
    gcSelectedParcelId: {      
      type: Number,
      default: -1
    },
    gcLayout: {
      type: String,
      default: 'vertical' // or horizontal
    },
    gcAvailableOptions: {
      type: String,
      default: 'widgetTitle'
    },
    gcWidgetCollapsed: {
      type: Boolean,
      default: true // or false
    },
    gcLanguage: {
      type: String,
      default: 'en' // 'en' | 'de'
    },
  },
  template: `<div :id="this.gcWidgetId" class="">

                <p :class="['gc-options-title', 'is-size-6', 'is-inline-block', !gcWidgetCollapsed ? 'is-grey' : 'is-orange']" 
                  style="cursor: pointer; margin-bottom: 0.5em;"    
                  v-on:click="toggleMessages" 
                  v-show="availableOptions.includes('widgetTitle')">
                    <!--i class="fas fa-th fa-sm"></i --> {{ $t('options.title')}}
                  <i :class="[!gcWidgetCollapsed ? '': 'is-active', 'fas', 'fa-angle-down', 'fa-sm']"></i>
                </p>

                <!-- message container -->
                <div :class="[!gcWidgetCollapsed ? '': 'is-hidden', layoutCSSMap['alignment'][gcLayout]]" style="width: 100%; margin-bottom: 1em; margin-top: 1em;">
                  <table class="table is-narrow is-fullwidth" v-model="messages" v-if="messages.length > 0">
                    <thead class="is-size-7">
                      <tr>
                        <th style="white-space: nowrap; text-transform: capitalize;">{{$t('table.header.timestamp')}}
                          <span class="" style="white-space: nowrap;">
                            <i class="fas fa-sort" style="cursor: pointer;" v-on:click="sortByAttribute('message_timestamp')"></i>
                          </span>
                        </th>
                        <th style="white-space: nowrap; text-transform: capitalize;">{{$t('table.header.code')}}
                          <span class="" style="white-space: nowrap;">
                            <i class="fas fa-sort" style="cursor: pointer;" v-on:click="sortByAttribute('message_code')"></i>
                          </span>
                        </th>
                        <th style="white-space: nowrap; text-transform: capitalize;">{{$t('table.header.description')}}
                          <span class="" style="white-space: nowrap;">
                            <i class="fas fa-sort" style="cursor: pointer;" v-on:click="sortByAttribute('message_description')"></i>
                          </span>
                        </th>
                        <th style="white-space: nowrap; text-transform: capitalize;">{{$t('table.header.content')}}
                          <span class="" style="white-space: nowrap;">
                            <i class="fas fa-sort" style="cursor: pointer;" v-on:click="sortByAttribute('message_content')"></i>
                          </span>
                        </th>
                        <th style="white-space: nowrap; text-transform: capitalize;">{{$t('table.header.priority')}}
                          <span class="" style="white-space: nowrap;">
                            <i class="fas fa-sort" style="cursor: pointer;" v-on:click="sortByAttribute('message_priority')"></i>
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="content is-small">
                      <tr v-for="m in messages">
                        <td><span class="is-small">{{m.message_timestamp}}</span></td>
                        <td><span class="is-small">{{m.message_code}}</span></td>
                        <td><span class="is-small">{{m.message_description}}</span></td>
                        <td><span class="is-small">{{m.message_content}}</span></td>
                        <td><span class="is-small">{{m.message_priority}}</span></td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="notification is-large is-grey" v-else>{{$t('table.nodata')}}</div>
                </div>

            </div><!-- gcWidgetId -->`,
  data: function () {
    console.debug("parceldata! - data()");
    return {
        messages: [],
        lastSortOrder: false,
        layoutCSSMap: { "alignment": {"vertical": "is-inline-block", "horizontal": "is-flex" }}
    }
  },
  i18n: { 
    locale: this.currentLanguage,
    messages: gcMessagesLocales
  },
  created: function () {
    console.debug("messages! - created()");
    this.changeLanguage();
  },
  /* when vue component is mounted (ready) on DOM node */
  mounted: function () {
    console.debug("messages! - mounted()");
    
    try {
      this.changeLanguage();
    } catch (ex) {}

  },
  computed: {
    apiKey: {
      get: function () {
          return this.gcApikey;
      }
    },
    apiHost: {
        get: function () {
            return this.gcHost;
        }
    },
    apiBaseUrl: {
        get: function () {
            return this.gcApiBaseUrl;
      }
    },
    apiSecure: {
      get: function () {
          return this.gcApiSecure;
      }
    },
    apiMajorVersion: {
      get () {
        if (this.apiBaseUrl === "/agknow/api/v3") {
          return 3
        }
        if (this.apiBaseUrl === "/agknow/api/v4") {
          return 4
        }
      }
    },
    selectedParcelId: {
      get: function () { 
        return this.gcSelectedParcelId;
      }
    },
    availableOptions: {
      get: function() {
        return (this.gcAvailableOptions.split(","));
      }
    },
    currentLanguage: {
      get: function() {
        // will always reflect prop's value 
        return this.gcLanguage;
      },
    },
  },
  watch: {
    currentLanguage(newValue, oldValue) {
      this.changeLanguage();
    },
    selectedParcelId(newValue, oldValue) {
      //get messages of current parcel
      this.getParcelMessages(newValue);
    },
  },
  methods: {  
    getApiUrl: function (endpoint) {
      /* handles requests directly against  geocledian endpoints with API keys
          or (if gcProxy is set)
        also requests against the URL of gcProxy prop without API-Key; then
        the proxy or that URL has to add the api key to the requests against geocledian endpoints
      */
      let protocol = 'http';

      if (this.apiSecure) {
        protocol += 's';
      }

      // if (this.apiEncodeParams) {
      //   endpoint = encodeURIComponent(endpoint);
      // }
      
      // with or without apikey depending on gcProxy property
      return (this.gcProxy ? 
                protocol + '://' + this.gcProxy + this.apiBaseUrl + endpoint  : 
                protocol + '://' + this.gcHost + this.apiBaseUrl + endpoint + "?key="+this.apiKey);
    },
    getParcelMessages(parcel_id) {

      if (!parcel_id || parcel_id < 0) {
        return
      }

      const endpoint = "/parcels/" + parcel_id + "/messages";

      //Show requests on the DEBUG console for developers
      console.debug("getParcelMessages()");
      console.debug("GET " + this.getApiUrl(endpoint));
      
      // Axios implement start
      axios({
        method: 'GET',
        url: this.getApiUrl(endpoint),
      }).then(function (response) {
        if(response.status === 200){
          var tmp = response.data;

          let obj;
          let resultNotEmpty;
          if (this.apiMajorVersion === 3) {
            console.debug(this.apiMajorVersion)
            resultNotEmpty = tmp.content.length > 0 ? true : false;
            obj = tmp.content[0];
          }
          if (this.apiMajorVersion === 4) {
            obj = tmp.content;
            resultNotEmpty = obj !== undefined ? true : false;
          }
          if (resultNotEmpty) {
            console.debug(tmp);

            this.messages = tmp.content;
            
          }
        } else {
          console.log(response)
        }
      }.bind(this)).catch(err => {
        console.log("err= " + err);
      })
      // Axios implement end
    },
    toggleMessages() {
      this.gcWidgetCollapsed = !this.gcWidgetCollapsed;
    },
    changeLanguage() {
      this.$i18n.locale = this.currentLanguage;
    },
    sortByAttribute: function (attribute) {
      console.debug("sorting by "+ attribute);

      this.lastSortOrder = !this.lastSortOrder;

      // don't sort with operators - function must return -1 or 1
      this.messages.sort( function (a,b) {
        if (this.lastSortOrder) {
          // check for object type, if so sort as string
          if (a[attribute] === Object(a[attribute])) {
            return JSON.stringify(a[attribute]) > JSON.stringify(b[attribute]) ? -1 : JSON.stringify(a[attribute]) < JSON.stringify(b[attribute]) ?  1 : 0 
          } else {
            return a[attribute] > b[attribute] ? -1 : a[attribute] < b[attribute] ?  1 : 0 
          }
        }
        else {
          // check for object type, if so sort as string
          if (a[attribute] === Object(a[attribute])) {
            return JSON.stringify(a[attribute]) > JSON.stringify(b[attribute]) ? 1 : JSON.stringify(a[attribute]) < JSON.stringify(b[attribute]) ?  -1 : 0
          } else {
            return a[attribute] > b[attribute] ? 1 : a[attribute] < b[attribute] ?  -1 : 0
          }
        }
      }.bind(this));

      // sort() will not trigger the rendering, so force it
      this.$forceUpdate();
    },
    formatDate(timestamp) {
      let time = timestamp.split('T')[0];
      let date = timestamp.split('T')[1];

      return date + '-' + time;
    }
  }
});
