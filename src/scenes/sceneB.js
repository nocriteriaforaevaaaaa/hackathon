import * as THREE from "three";
import { loadAsset } from "../helpers/gltfLoader";

export const getMoonSunEarthSceneB = async (setup) => {
	if (setup.isSceneB) {
		setup.camera.position.set(0, 150, 700);
	}
	const EOMajorAxis = 199.0 * 2;
	const EOMinorAxis = 150 * 2;
	const MOMajorAxis = 76.88;
	const MOMinorAxis = 60.76;
	const axishelper = new THREE.AxesHelper(10);
	setup.sceneB.add(axishelper);

	const earthCurve = new THREE.EllipseCurve(
		0,
		0, // ax, aY
		EOMajorAxis,
		EOMinorAxis, // xRadius, yRadius
		0,
		2 * Math.PI, // aStartAngle, aEndAngle
		false, // aClockwise
		0 // aRotation
	);
	const earthPoints = earthCurve.getPoints(1000);
	const EOGeometry = new THREE.BufferGeometry().setFromPoints(earthPoints);
	const EOMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
	const moonScale = 1;
	const sunScale = 10;
	const earthScale = 4;
	const gridH = new THREE.GridHelper(2000, 1000, 0x4a4a4a);
	const sunPlight = new THREE.PointLight(0xffffff, 100000);
	sunPlight.castShadow = true;

	const moonCurve = new THREE.EllipseCurve(
		0,
		0, // ax, aY
		MOMajorAxis,
		MOMinorAxis, // xRadius, yRadius
		0,
		2 * Math.PI, // aStartAngle, aEndAngle
		false, // aClockwise
		0 // aRotation
	);
	const moonPoints = moonCurve.getPoints(1000);
	const MOGeometry = new THREE.BufferGeometry().setFromPoints(moonPoints);
	const MOMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
	const gltfMoon = await loadAsset("../public/models/moon.glb");
	let moonModel = gltfMoon.children[0];
	moonModel.scale.z *= moonScale;
	moonModel.scale.x *= moonScale;
	moonModel.scale.y *= moonScale;
	moonModel.castShadow = true;
	moonModel.receiveShadow = true;
	const gltfSun = await loadAsset("../public/models/sun_model.glb");
	gltfSun.scale.z *= sunScale;
	gltfSun.scale.x *= sunScale;
	gltfSun.scale.y *= sunScale;
	const gltfEarth = await loadAsset("../public/models/earth.glb");
	let earthModel = gltfEarth.children[0];
	earthModel.scale.z *= earthScale;
	earthModel.scale.x *= earthScale;
	earthModel.scale.y *= earthScale;
	earthModel.castShadow = true;
	earthModel.receiveShadow = true;
	sunPlight.position.set(-25, 0, 0);

	const ambiLight = new THREE.AmbientLight(0xffffff, 1);
	gltfSun.position.set(-25, 0, 0);
	gltfMoon.position.set(0, 0, 0);
	gltfEarth.position.set(0, 0, 0);

	const EOEllipse = new THREE.Line(EOGeometry, EOMaterial);
	const MOEllipse = new THREE.Line(MOGeometry, MOMaterial);
	MOEllipse.rotateX(Math.PI / 2);
	EOEllipse.rotateX(Math.PI / 2);
	EOEllipse.position.set(0, 0, 0);
	const obj = new THREE.Object3D();

	MOEllipse.add(gltfMoon);
	obj.add(MOEllipse);

	//red light for moon
	const red_light_moon = new THREE.SpotLight(0xff0000, 0.5);
	red_light_moon.angle = Math.PI / 4;
	red_light_moon.decay = 0;
	const static_moon = new THREE.Object3D();
	red_light_moon.target = static_moon;
	setup.sceneB.add(red_light_moon, red_light_moon.target);

	//spotlight for umbra & pnumbra

	const spotLight = new THREE.SpotLight(0xffffff, 4);
	spotLight.decay = 0;
	spotLight.position.set(0, 0, 0);
	spotLight.target = gltfEarth;
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024 * 2;
	spotLight.shadow.mapSize.height = 1024 * 2;
	spotLight.penumbra = 1;
	spotLight.shadow.radius = 4;

	const spotLight_ = new THREE.SpotLight(0xffffff, 3);
	spotLight_.decay = 0;
	spotLight_.position.set(0, 0, 0);
	spotLight_.target = gltfEarth;
	spotLight_.castShadow = true;
	spotLight_.shadow.mapSize.width = 1024 * 2;
	spotLight_.shadow.mapSize.height = 1024 * 2;
	spotLight_.penumbra = 0;
	spotLight_.shadow.normalBias = 3;
	spotLight_.shadow.radius = 0;

	//helper
	// const spotLightHelper = new THREE.SpotLightHelper( spotLight );
	// setup.sceneB.add( spotLightHelper,spotLight_ );

	//replaced sunPlight with spotLight
	setup.sceneB.add(gltfSun, spotLight, gltfEarth, EOEllipse, obj);
	return {
		moonCurve,
		earthCurve,
		MOEllipse,
		EOEllipse,
		gltfMoon,
		gltfEarth,
		gltfSun,
		obj,
		static_moon,
		red_light_moon,
	};
};
