import './style.css';
import 'material-icons/iconfont/material-icons.css';
import mapboxgl from 'mapbox-gl';
import { doFetch } from './functions/fetch';
import { Restaurant, WeeklyMenu } from './interfaces/Restaurant';
import { Point } from 'geojson';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: [24, 61], // starting position [lng, lat]
  zoom: 5, // starting zoom
  pitch: 45,
  bearing: 0,
  antialias: true,
});

// open hamburger menu
const menu = document.querySelector('#nav-links');
const hamburger = document.querySelector('#hamburger');
hamburger?.addEventListener('click', () => {
  menu?.classList.toggle('hidden');
  // change hamburger icon to close icon
  hamburger.innerHTML = menu?.classList.contains('hidden') ? 'menu' : 'close';
});

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
    const restaurants = await doFetch(
      (import.meta.env.VITE_API_URL as string) + '/restaurants',
    );
    console.log(restaurants);
    // get data from restaurants and convert it to GeoJSON feature collection
    const geojson = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: restaurants.map((restaurant: Restaurant) => {
          const { location, ...rest } = restaurant;
          const feature: GeoJSON.Feature<GeoJSON.Point> = {
            type: 'Feature',
            geometry: location as Point,
            properties: {
              description: `
                <div class="flex flex-col">
                  <h3 class="text-lg">${rest.name} - ${rest.company}</h3>
                  <p>${rest.address}</p>
                  <p>${rest.postalCode} ${rest.city}</p>
                  <button class="popup-btn view-daily-menu" data-id="${rest._id}">View today's menu</button>
                  <button class="popup-btn view-weekly-menu" data-id="${rest._id}">View this week's menu</button>
                  <button class="popup-btn add-favourite" data-id="${rest._id}">Add as favourite</button>
                </div>
              `,
              icon: 'restaurant',
            },
          };
          return feature;
        }),
      },
    };
    console.log(geojson);
    map.addSource('restaurants', geojson as any);
    map.addLayer({
      id: 'restaurants',
      type: 'symbol',
      source: 'restaurants',
      layout: {
        'icon-image': ['get', 'icon'],
        'icon-allow-overlap': true,
      },
    });
    map.on(
      'click',
      'restaurants',
      (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const popup = new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);

        const viewMenu = popup.getElement().querySelector('.view-daily-menu');
        viewMenu?.addEventListener('click', async (evt) => {
          try {
            const menu = await doFetch(
              (import.meta.env.VITE_API_URL as string) +
                '/restaurants/daily/' +
                (evt.currentTarget as HTMLElement).dataset.id +
                '/fi',
            );
            console.log(menu);
          } catch (error) {
            console.log((error as Error).message);
          }
        });

        const viewWeeklyMenu = popup
          .getElement()
          .querySelector('.view-weekly-menu');
        viewWeeklyMenu?.addEventListener('click', async (evt) => {
          try {
            const menu = (await doFetch(
              (import.meta.env.VITE_API_URL as string) +
                '/restaurants/weekly/' +
                (evt.currentTarget as HTMLElement).dataset.id +
                '/fi',
            )) as WeeklyMenu;
            console.log(menu);
            const weeklyMenu = document.querySelector(
              '#menu-week',
            ) as HTMLDialogElement;
            weeklyMenu.querySelector('.modal-body')!.innerHTML = '';
            menu.days.forEach((menuItem) => {
              const day = document.createElement('h3');
              day.classList.add('day');
              day.textContent = menuItem.date;

              const menuList = document.createElement('ul');
              menuList.classList.add('menu-list');
              menuItem.courses.forEach((course) => {
                const menuItemElement = document.createElement('li');
                menuItemElement.classList.add('menu-item');
                menuItemElement.innerHTML = `
                <h4>${course.name}</h4>
                <p>${course.diets}</p>
                <p>${course.price}</p>
              `;
                menuList.appendChild(menuItemElement);
              });
              weeklyMenu?.querySelector('.modal-body')?.appendChild(day);
              weeklyMenu?.querySelector('.modal-body')?.appendChild(menuList);
            });
            weeklyMenu?.showModal();
            console.log(weeklyMenu);
          } catch (error) {
            console.log((error as Error).message);
          }
        });

        const addFavourite = popup.getElement().querySelector('.add-favourite');
        addFavourite?.addEventListener('click', (evt) => {
          console.log((evt.currentTarget as HTMLElement).dataset.id);
        });
      },
    );

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'restaurants', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'restaurants', () => {
      map.getCanvas().style.cursor = '';
    });
  } catch (error) {
    console.log((error as Error).message);
  }
});

// modal close buttons
const modalCloseButtons = document.querySelectorAll('dialog .close-btn');
modalCloseButtons.forEach((button) => {
  button.addEventListener('click', (evt) => {
    (evt.currentTarget as HTMLElement).closest('dialog')?.close();
  });
});
