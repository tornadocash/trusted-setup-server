(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{370:function(t,e,n){"use strict";n(89),n(27),n(28),n(16),n(64),n(40),n(116),n(22);var r=n(48),o=n(65);function c(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function l(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?c(Object(source),!0).forEach((function(e){Object(r.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):c(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}var m={computed:l(l({},Object(o.c)("user",["isLoggedIn","hasErrorName"])),{},{userName:{get:function(){return this.$store.state.user.name},set:function(t){this.$store.commit("user/SET_NAME",t)}},userCompany:{get:function(){return this.$store.state.user.company},set:function(t){this.$store.commit("user/SET_COMPANY",t)}}}),methods:l(l({},Object(o.b)("user",["makeTweet","logInVia","logOut"])),{},{restrictSymbols:function(t){var e=new RegExp("[^0-9a-zA-Z\\x20]","g");this[t]=this[t].replace(e,"")}})},d=n(10),component=Object(d.a)(m,(function(){var t,e=this,n=e.$createElement,r=e._self._c||n;return r("div",{staticClass:"form"},[e.isLoggedIn?r("div",{staticClass:"fields"},[r("button",{staticClass:"button is-icon logout",on:{click:e.logOut}},[r("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[r("path",{attrs:{fill:"#94febf",d:"M14.08,15.59L16.67,13H7V11H16.67L14.08,8.41L15.5,7L20.5,12L15.5,17L14.08,15.59M19,3A2,2 0 0,1 21,5V9.67L19,7.67V5H5V19H19V16.33L21,14.33V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19Z"}})])]),e._v(" "),r("b-field",{attrs:{type:{"is-danger":e.hasErrorName.invalid},message:(t={},t[e.hasErrorName.msg]=e.hasErrorName.invalid,t),label:"Name"}},[r("b-input",{attrs:{maxlength:"35"},on:{blur:function(t){return e.restrictSymbols("userName")}},model:{value:e.userName,callback:function(t){e.userName=t},expression:"userName"}})],1),e._v(" "),r("b-field",{attrs:{label:"Project"}},[r("b-input",{attrs:{maxlength:"35"},on:{blur:function(t){return e.restrictSymbols("userCompany")}},model:{value:e.userCompany,callback:function(t){e.userCompany=t},expression:"userCompany"}})],1)],1):r("div",{staticClass:"buttons"},[r("b-button",{attrs:{type:"is-primary",outlined:"",expanded:""},on:{click:function(t){return e.logInVia("twitter")}}},[e._v("\n      Sign in with Twitter\n    ")]),e._v(" "),r("b-button",{attrs:{type:"is-primary",outlined:"",expanded:""},on:{click:function(t){return e.logInVia("github")}}},[e._v("\n      Sign in with Github\n    ")])],1)])}),[],!1,null,null,null);e.a=component.exports},373:function(t,e,n){"use strict";n.r(e);n(89),n(27),n(28),n(16),n(64),n(22),n(40),n(23);var r=n(3),o=n(48),c=n(65);function l(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function m(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}var d={components:{Form:n(370).a},data:function(){return{token:null,status:{type:"",msg:""},hideSaveBtn:!1}},computed:m(m(m({},Object(c.d)("user",["name","handle","company","contributionIndex"])),Object(c.c)("user",["isLoggedIn","hasErrorName"])),{},{title:function(){return"is-danger"!==this.status.type&&this.contributionIndex?this.isLoggedIn?"Please, specify your name and project.":"Would you like to provide identity for your contribution #".concat(this.contributionIndex,"?"):null}}),mounted:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.$root.$emit("enableLoading"),e.next=3,t.getUserData();case 3:if(t.token=t.$route.query.token,t.token){e.next=8;break}window.location.replace(window.location.origin),e.next=10;break;case 8:return e.next=10,t.getContributionIndex();case 10:setTimeout((function(){t.$root.$emit("disableLoading")}),800);case 11:case"end":return e.stop()}}),e)})))()},methods:m(m({},Object(c.b)("user",["getUserData","makeTweet"])),{},{authorize:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){var body,n,r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return body={token:t.token,name:t.name,company:t.company},e.prev=1,e.next=4,fetch("/api/authorize_contribution",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(body)});case 4:if(!(n=e.sent).ok){e.next=11;break}t.status.msg="Your contribution has been updated.",t.status.type="is-success",t.hideSaveBtn=!0,e.next=16;break;case 11:return e.next=13,n.text();case 13:r=e.sent,t.status.msg=r,t.status.type="is-danger";case 16:e.next=22;break;case 18:e.prev=18,e.t0=e.catch(1),t.status.msg="Something went wrong. Please contact support",t.status.type="is-danger";case 22:case"end":return e.stop()}}),e,null,[[1,18]])})))()},getContributionIndex:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){var body,n,r,o,c;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return body={token:t.token},e.prev=1,e.next=4,fetch("/api/get_contribution_index",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(body)});case 4:if(!(n=e.sent).ok){e.next=13;break}return e.next=8,n.json();case 8:r=e.sent,o=r.id,t.$store.commit("user/SET_CONTRIBUTION_INDEX",o),e.next=19;break;case 13:return e.next=15,n.text();case 15:c=e.sent,t.status.msg=c,t.status.type="is-danger",t.hideSaveBtn=!0;case 19:e.next=25;break;case 21:e.prev=21,e.t0=e.catch(1),t.status.msg="Something went wrong. Please contact support",t.status.type="is-danger";case 25:case"end":return e.stop()}}),e,null,[[1,21]])})))()}})},f=n(10),component=Object(f.a)(d,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"ceremony"},[n("h1",{staticClass:"title is-size-1 is-size-2-mobile is-spaced"},[t._v("\n    Hello, "),n("span",[t._v("@"+t._s(t.handle))])]),t._v(" "),n("h2",{staticClass:"subtitle"},[t._v("\n    "+t._s(t.title)+"\n  ")]),t._v(" "),n("fieldset",{staticClass:"authorize",attrs:{disabled:t.hideSaveBtn}},[n("Form")],1),t._v(" "),n("div",{staticClass:"buttons is-centered"},[t.isLoggedIn&&!t.hideSaveBtn?n("b-button",{attrs:{disabled:t.hasErrorName.invalid,type:"is-primary",outlined:""},on:{click:t.authorize}},[t._v("\n      Save information\n    ")]):t._e()],1),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:""!==t.status.type,expression:"status.type !== ''"}],staticClass:"status"},[n("div",{staticClass:"status-message",class:t.status.type},[t._v(t._s(t.status.msg))]),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:"is-success"===t.status.type,expression:"status.type === 'is-success'"}],staticClass:"status-message is-success"},[t._v("\n      Now you can post your attestation to Twitter.\n      "),n("div",{staticClass:"buttons is-centered"},[n("b-button",{attrs:{type:"is-primary",tag:"a",target:"_blank",outlined:""},on:{click:t.makeTweet}},[t._v("\n          Post attestation\n        ")])],1)])])])}),[],!1,null,null,null);e.default=component.exports}}]);