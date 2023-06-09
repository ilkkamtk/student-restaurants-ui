import './style.css';
import 'material-icons/iconfont/material-icons.css';
import mapboxgl from 'mapbox-gl';
import { doFetch } from './functions/fetch';
import { Restaurant } from './interfaces/Restaurant';
import { FeatureCollection } from './interfaces/FeatureCollection';
import createPopup from './components/createPopup';
import { registerSW } from 'virtual:pwa-register';
import { pwaInfo } from 'virtual:pwa-info';
import updateUserData from './functions/updateUserdata';
import createAlert from './components/createAlert';
import activate from './functions/activate';
import accountInfo from './components/accountInfo';
import login from './components/login';
import register from './components/register';
import logoutButton from './components/logoutButton';
import updateUser from './components/updateUser';
import uploadAvatar from './components/uploadAvatar';
import createRestaurant from './components/createRestaurant';
import { apiURL, mapBoxToken } from './utils/variables';

console.log(pwaInfo);

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('onNeedRefresh');
    const update = confirm('New version available. Update?');
    if (update) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('onOfflineReady');
    createAlert('App is offline ready');
  },
});

// get query param token
const urlParams = new URLSearchParams(window.location.search);
const activateToken = urlParams.get('activate');
console.log(activateToken);
if (activateToken) {
  activate(activateToken);
}

(async () => {
  // global variables
  let loggedIn = false;

  mapboxgl.accessToken = mapBoxToken;

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [24, 61], // starting position [lng, lat]
    zoom: 5, // starting zoom
    pitch: 45,
    bearing: 0,
    antialias: true,
  });

  map.addControl(new mapboxgl.NavigationControl());

  // follow user and set map center to user location, add red marker to user location
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position);
      map.setCenter([position.coords.longitude, position.coords.latitude]);
      map.setZoom(12);
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat([position.coords.longitude, position.coords.latitude])
        .addTo(map);
    },
    (error) => {
      console.log(error);
    },
  );

  map.on('style.load', async () => {
    // Insert the layer beneath any symbol layer.
    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
      (layer) => layer.type === 'symbol' && layer.layout!['text-field'],
    )?.id;

    // The 'building' layer in the Mapbox Streets
    // vector tileset contains building height data
    // from OpenStreetMap.
    map.addLayer(
      {
        id: 'add-3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',

          // Use an 'interpolate' expression to
          // add a smooth transition effect to
          // the buildings as the user zooms in.
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height'],
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height'],
          ],
          'fill-extrusion-opacity': 0.6,
        },
      },
      labelLayerId,
    );
    try {
      const restaurants = await doFetch(apiURL + '/restaurants');
      // console.log(restaurants);
      // get data from restaurants and convert it to GeoJSON feature collection
      const geojsonData: FeatureCollection = {
        type: 'FeatureCollection',
        features: restaurants.map((restaurant: Restaurant) => {
          const feature: GeoJSON.Feature<GeoJSON.Point> = {
            type: 'Feature',
            geometry: restaurant.location,
            properties: {
              restaurant,
            },
          };
          return feature;
        }),
      };
      console.log(geojsonData);

      // add markers to map
      for (const feature of geojsonData.features) {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';
        const popupElement = createPopup(feature.properties.restaurant);
        popupElement.addEventListener('favourite-added', () => {
          updateAccount();
        });
        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
          .setLngLat(feature.geometry.coordinates as mapboxgl.LngLatLike)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
              .setDOMContent(popupElement),
          )
          .addTo(map);
      }

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on('mouseenter', 'restaurants', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'restaurants', () => {
        map.getCanvas().style.cursor = '';
      });
    } catch (error) {
      console.log(error);
    }
  });

  // modal close buttons
  const modalCloseButtons = document.querySelectorAll('dialog .close-btn');
  modalCloseButtons.forEach((button) => {
    button.addEventListener('click', (evt) => {
      (evt.currentTarget as HTMLElement).closest('dialog')?.close();
    });
  });

  // open account modal
  const openAccountModal = document.querySelector('#account-btn');
  const accountModal = document.querySelector('#account') as HTMLDialogElement;
  openAccountModal?.addEventListener('click', () => {
    accountModal.showModal();
  });

  // account modal content:
  const accountModalContent = accountModal.querySelector('.modal-body');

  // account info
  const { userInfo, username, email, avatar, favouriteButton } = accountInfo();
  const account = accountModalContent?.appendChild(userInfo);

  // login form
  const loginForm = accountModalContent?.appendChild(login());
  loginForm?.addEventListener('login-success', async () => {
    updateAccount();
  });

  // register form
  const registerForm = accountModalContent?.appendChild(register());

  // logout button
  const logoutBtn = accountModalContent?.appendChild(logoutButton());
  logoutBtn?.addEventListener('logout-success', async () => {
    console.log('häär');
    updateAccount();
  });

  // update user data
  const updateUsr = accountModalContent?.appendChild(updateUser());
  updateUsr?.addEventListener('update-success', async () => {
    updateAccount();
  });

  // upload avatar
  const uploadAva = accountModalContent?.appendChild(uploadAvatar());
  uploadAva?.addEventListener('upload-success', async () => {
    updateAccount();
  });

  async function updateAccount() {
    try {
      const userData = await updateUserData(
        username,
        email,
        avatar,
        favouriteButton,
      );

      console.log(userData);
      if (userData !== null) {
        loggedIn = true;
      } else {
        loggedIn = false;
      }

      if (loggedIn && userData !== null) {
        account?.classList.remove('hidden');
        loginForm?.classList.add('hidden');
        registerForm?.classList.add('hidden');
        logoutBtn?.classList.remove('hidden');
        updateUsr?.classList.remove('hidden');
        uploadAva?.classList.remove('hidden');

        if (userData.favouriteRestaurant) {
          const restaurantModal = await createRestaurant(
            userData?.favouriteRestaurant,
          );
          restaurantModal.showModal();
          // load restaurant info show restaurant modal
          favouriteButton.addEventListener('click', async () => {
            restaurantModal.showModal();
          });
        } else {
          favouriteButton.classList.add('hidden');
        }
      } else {
        account?.classList.add('hidden');
        loginForm?.classList.remove('hidden');
        registerForm?.classList.remove('hidden');
        logoutBtn?.classList.add('hidden');
        updateUsr?.classList.add('hidden');
        uploadAva?.classList.add('hidden');
      }
    } catch (error) {
      console.log(error);
    }
  }

  await updateAccount();
})();
