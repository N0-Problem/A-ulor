# 아울러 (A-ulor)
### 전국 교통약자 이동지원센터(콜택시 서비스) 정보 통합 앱


<img src="https://user-images.githubusercontent.com/68420044/189951398-62c3f62f-7e16-4540-bf24-4e9f556e52c4.png" width="150"/>
  


**아울러 (A-ulor)** 는 ***2022 공개SW 개발자 대회***을 위한 프로젝트로, 
 각 지역의 교통약자 이동지원센터(콜택시 서비스)들의 정보를 한 곳에 모아 이용자들이 원하는 서비스를 쉽게 찾고 접근하여 이용할 수 있도록 해주는 어플리케이션이다. 각 지역마다 통일되어 있지 않은 서비스로 인해 교통약자들이 겪고 있는 다양한 어려움에 도움이 될 수 있을 것이다.  

**A-ulor** is a project for **2022 Open SW Developer Competition**
It is an application that collects information from transportation support centers (call taxi services) in each region so that users can easily find, access, and use the services they want. It will be helpful to various difficulties facing the transportation vulnerable due to unification of services in each region.  


## Table of Contents
* [Getting Started](#getting-started)
* [System Architecture](#system-architecture)
* [Introduction](#introduction)
  + [Project purpose](#project-purpose)
  + [Description](#description)
* [Tech Skills and Tools](#tech-skills-and-tools)
* [Open Source Libraries](#open-source-libraries)
* [Demo](#demo)
* [Contributors](#contributors)

## Getting Started

```
$ git clone https://github.com/N0-Problem/A-ulor.git
$ npm install

$ npx react-native run-android
or 
$ npx react-native start
$ react-native run-android // another terminal
```

## System Architecture
<img src="https://user-images.githubusercontent.com/68420044/189953518-a93bcccd-31ee-4da1-afef-da75b1f34301.png" width="70%">



## Introduction
### Project purpose
> 최근 교통약자의 이동권 보장에 대한 문제가 대두되고 있다. 교통약자들은 지하철과 버스 등의 대규모 대중교통 뿐만 아니라 택시를 이용하는 것도 어려움을 겪고 있다. 이를 위해 교통약자를 위한 서비스인 교통약자 콜택시가 전국에서 시행되고 있으나, 각 지역마다 제공하는 정보나 규정 및 승인 절차가 다른 문제점들로 인해 이용자들이 불편함을 겪고 있다. 이에 각 지역의 교통약자 이동지원센터(콜택시 서비스)들의 정보를 한 곳에 모아 이용자들이 원하는 서비스를 쉽게 찾고 접근하여 이용할 수 있는 서비스를 제공하고자 한다.  

> Recently, the problem of guaranteeing the right to move for the weak has emerged. The vulnerable have difficulty using taxis as well as large-scale public transportation such as subways and buses. To this end, call taxis for the weak, which are services for the weak in transportation, are being implemented nationwide, but users are experiencing inconvenience due to problems with different information, regulations, and approval procedures provided in each region. Accordingly, we intend to provide a service that allows users to easily find, access, and use the services they want by collecting information from the transportation vulnerable mobile support centers (call taxi services) in each region.

### Description
> 공공데이터포털에서 제공하는 '전국교통약자이동지원센터정보표준데이터' 데이터 셋을 활용하였다.  
Ref : https://www.data.go.kr/data/15028207/standard.do

> The data set of 'National Transportation Weak Support Center Information Standard Data' provided by the public data portal was used. 



## Tech Skills and Tools
![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=java&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)
![Android Studio](https://img.shields.io/badge/Android%20Studio-3DDC84.svg?style=for-the-badge&logo=android-studio&logoColor=white)

## Open Source Libraries
> #### @react-native-community/cli-platform-android (버전 : 8.0.5)  
> license : MIT   
> link : [https://github.com/react-native-community/cli/tree/master/packages/platform-android](https://github.com/react-native-community/cli/tree/master/packages/platform-android)

> #### @react-native-community/slider (버전 : 4.3.1)    
> description : React Native component used to select a single value from a range of values.   
> license : MIT   
> link : [https://github.com/callstack/react-native-slider#readme](https://github.com/callstack/react-native-slider#readme)

> #### @react-native-firebase/app (버전 : 15.4.0)   
> description : A well tested, feature rich Firebase implementation for React Native, supporting iOS & Android. Individual module support for Admob, Analytics, Auth, Crash Reporting, Cloud Firestore, Database, Dynamic Links, Functions, Messaging (FCM), Remote Config, Storage and more.   
> license : Apache-2.0     
> link : [https://github.com/invertase/react-native-firebase/tree/main#readme](https://github.com/invertase/react-native-firebase/tree/main#readme)

> #### @react-native-firebase/auth (버전 : 15.4.0)   
> description : React Native Firebase - The authentication module provides an easy-to-use API to integrate an authentication workflow into new and existing applications. React Native Firebase provides access to all Firebase authentication methods and identity providers.   
> license : Apache-2.0   
> link : [https://github.com/invertase/react-native-firebase/tree/main#readme](https://github.com/invertase/react-native-firebase/tree/main#readme)

> #### @react-native-firebase/firestore (버전 : 15.4.0)   
> description : React Native Firebase - Cloud Firestore is a NoSQL cloud database to store and sync data between your React Native application and Firebase's database. The API matches the Firebase Web SDK whilst taking advantage of the native SDKs performance and offline capabilities.  
> license : Apache-2.0    
> link : [https://github.com/invertase/react-native-firebase/tree/main#readme](https://github.com/invertase/react-native-firebase/tree/main#readme)

> #### @react-native-firebase/storage (버전 : 15.4.0)   
> description : React Native Firebase - React Native Firebase provides native integration with Cloud Storage, providing support to upload and download files directly from your device and from your Firebase Cloud Storage bucket.   
> license : Apache-2.0    
> link : [https://github.com/invertase/react-native-firebase/tree/main#readme](https://github.com/invertase/react-native-firebase/tree/main#readme)

> #### @react-native-google-signin/google-signin (버전 : 8.0.0)    
> description : Google Signin for your react native applications   
> license : MIT   
> link : [https://github.com/react-native-google-signin/google-signin#readme](https://github.com/react-native-google-signin/google-signin#readme)

> #### @react-native-picker/picker (버전 : 2.4.4)  
> description : React Native Picker for iOS, Android, macOS, and Windows   
> license : MIT     
> link : [https://github.com/react-native-picker/picker#readme](https://github.com/react-native-picker/picker#readme)

> #### @react-navigation/bottom-tabs (버전 : 6.3.2)   
> description : Bottom tab navigator following iOS design guidelines   
> license : MIT  
> link : [https://github.com/react-navigation/react-navigation#readme](https://github.com/react-navigation/react-navigation#readme)

> #### @react-navigation/drawer (버전 : 6.4.3)   
> description : Drawer navigator component with animated transitions and gesturess   
> license : MIT   
> link : [https://reactnavigation.org/docs/drawer-navigator/](https://reactnavigation.org/docs/drawer-navigator/)

> #### @react-navigation/native (버전 : 6.0.11)   
> description : Native stack navigator using react-native-screens   
> license : MIT   
> link : [https://github.com/software-mansion/react-native-screens#readme](https://github.com/software-mansion/react-native-screens#readme)

> #### react (버전 : 17.0.2)    
> description : React is a JavaScript library for building user interfaces.   
> license : MIT    
> link : [https://reactjs.org/](https://reactjs.org/)  

> #### react-native (버전 : 0.68.2)   
> description : A framework for building native apps using React   
> license : MIT   
> link : [https://github.com/facebook/react-native#readme](https://github.com/facebook/react-native#readme)

> #### react-native-calendars (버전 : 1.1288.2)   
> description : React Native Calendar Components    
> license : MIT   
> link : [https://github.com/wix/react-native-calendars#readme](https://github.com/wix/react-native-calendars#readme)

> #### react-native-cli (버전 : 2.0.1)   
> description : The React Native CLI tools  
> license : BSD-3-Clause  
> link : [https://github.com/facebook/react-native#readme](https://github.com/facebook/react-native#readme)

> #### react-native-date-picker (버전 : 4.2.5)  
> description : A datetime picker for React Native. In-modal or inlined. Supports Android and iOS.  
> license : MIT  
> link : [https://github.com/henninghall/react-native-date-picker](https://github.com/henninghall/react-native-date-picker)

> #### react-native-document-picker (버전 : 8.1.2)  
> description : A react native interface to access documents from dropbox, google drive, iCloud...   
> license : MIT   
> link : [https://github.com/rnmods/react-native-document-picker#readme](https://github.com/rnmods/react-native-document-picker#readme)

> #### react-native-dropdown-picker (버전 : 5.4.2)  
> description : A single / multiple, categorizable, customizable, localizable and searchable item picker (drop-down) component for react native which supports both Android & iOS.  
> license : MIT  
> link : [https://hossein-zare.github.io/react-native-dropdown-picker-website/](https://hossein-zare.github.io/react-native-dropdown-picker-website/)

> #### react-native-gesture-handler (버전 : 2.5.0)  
> description : Experimental implementation of a new declarative API for gesture handling in react-native  
> license : MIT  
> link : [https://github.com/software-mansion/react-native-gesture-handler#readme](https://github.com/software-mansion/react-native-gesture-handler#readme)

> #### react-native-maps (버전 : 1.2.0)  
> description : React Native Mapview component for iOS + Android   
> license : MIT  
> link : [https://github.com/react-native-maps/react-native-maps#readme](https://github.com/react-native-maps/react-native-maps#readme)

> #### react-native-modal-datetime-picker (버전 : 14.0.0)  
> description : A react-native datetime-picker for Android and iOS   
> license : MIT   
> link : [https://github.com/mmazzarolo/react-native-modal-datetime-picker](https://github.com/mmazzarolo/react-native-modal-datetime-picker)

> #### react-native-paper (버전 : 4.12.4)  
> description : Material design for React Native   
> license : MIT  
> link : [https://callstack.github.io/react-native-paper](https://callstack.github.io/react-native-paper)

> #### react-native-reanimated (버전 : 2.9.1)  
> description : More powerful alternative to Animated library for React Native.  
> license : MIT   
> link : [https://github.com/software-mansion/react-native-reanimated#readme](https://github.com/software-mansion/react-native-reanimated#readme)

> #### react-native-safe-area-context (버전 : 4.3.1)  
> description : A flexible way to handle safe area, also works on Android and web.   
> license : MIT    
> link : [https://github.com/th3rdwave/react-native-safe-area-context#readme](https://github.com/th3rdwave/react-native-safe-area-context#readme)

> #### react-native-screens (버전 : 3.16.0)  
> description : Native navigation primitives for your React Native app.  
> license : MIT   
> link : [https://github.com/software-mansion/react-native-screens#readme](https://github.com/software-mansion/react-native-screens#readme)

> #### react-native-splash-screen (버전 : 3.3.0)   
> description : A splash screen for react-native, hide when application loaded ,it works on iOS and Android.    
> license : MIT    
> link : [https://github.com/crazycodeboy/react-native-splash-screen#readme](https://github.com/crazycodeboy/react-native-splash-screen#readme)

> #### react-native-swiper (버전 : 1.6.0-rc.3)  
> description : Swiper component for React Native.  
> license : MIT  
> link : [https://github.com/oblador/react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)

> #### rn-fetch-blob (버전 : 0.12.0)  
> description : A module provides upload, download, and files access API. Supports file stream read/write for process large files.  
> license : MIT  
> link : [https://github.com/joltup/rn-fetch-blob#readme](https://github.com/joltup/rn-fetch-blob#readme)


## Demo
[2022 공개 SW 개발자 대회 - No Problem 팀 시연영상](https://www.youtube.com/watch?v=hCoC6Z7D1MY&t=8s)

## Contributors
All participants in this project are majoring in Computer Science Engieneering, Dongguk University🏫

| Name             | Email                 | Github                           | Role      |
|------------------|-----------------------|----------------------------------|-----------|
| 👧🏻 DongYeon Kang(Team Member) | myjjue00@gmail.com    | https://github.com/dongyeon-0822 | Front-end |
| 🧒🏻 Gunwoo Kim(Team Member)    | gun0005@naver.com     | https://github.com/Gu-nuu        | Front-end |
| 👱🏻‍♂️ Taekyu Lee(Team Leader)   | dnjsqls2008@gmail.com | https://github.com/leetaekyu2077 | Back-end  |
