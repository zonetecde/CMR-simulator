export default interface Coordonnees {
	x: number;
	y: number;
	direction:
		| 'Up'
		| 'Down'
		| 'Left'
		| 'Right'
		| 'TopLeft'
		| 'TopRight'
		| 'BottomLeft'
		| 'BottomRight';
	int: number;
}
