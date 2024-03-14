export default interface Coordonnees {
	id: number;
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
		| 'BottomRight'
		| string;
	int: number;
	marked: boolean;
}
