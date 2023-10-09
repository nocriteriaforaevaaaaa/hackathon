export const rotatePlanets = (moon, earth) => {
	moon.rotation.y += 0.01;
	earth.rotation.y += 0.01;
};
let theta1 = 0;
let theta2 = 0;
export const revolveOnEllipse = (
	moonCurve,
	earthCurve,
	moon,
	earth,
	MOEllipse,
	obj,
	red_light_moon,
	static_moon
) => {
	function revolveMoon() {
		theta1 += 0.001;
		let point = moonCurve.getPoint(theta1);
		const maxAngle = (Math.PI / 180) * 15;
		moon.position.x = point.x;
		moon.position.y = point.y;
		moon.position.z = 0;
		MOEllipse.rotation.y = Math.sin(theta1) * maxAngle;
	}
	function revolveEarth() {
		theta2 += 0.0001;
		let point = earthCurve.getPoint(theta2);
		earth.position.x = point.x;
		earth.position.y = 0;
		earth.position.z = point.y;
		obj.position.copy(earth.position);
	}
	revolveMoon();
	revolveEarth();
	red_light_moon.position.set(earth.position.x*1.01,earth.position.y*1.01,earth.position.z*1.01)
	static_moon.position.set(earth.position.x*1.2,earth.position.y*1.2,earth.position.z*1.2)
};
