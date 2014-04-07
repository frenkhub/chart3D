
/*********************
	Bar char
*********************/


	//--------------------------------------------------------------------
	// create a bar chart
	function plotBarCh(data, n) { 
	// data: table
	// n: #elements for row

		var chart, item, row, col, 
				y_size, x_size, z_size;
		
		chart = new THREE.Object3D();
		
		x_size = 2*(data.length / n) - 1;
		z_size = 2*n - 1;
		y_size = 0;
		
		for (var i=0; i<data.length; i++) {
			row = div(i, n);
			col = i % n;
	
			// new item bar
			item = bar( data[i], getColor( col ) );
			item.position.x = 0.5 + 2*row - (x_size / 2);
			item.position.z = 0.5 + 2*col - (z_size / 2);
			chart.add( item );
		
			y_size = Math.max(y_size, data[i]);
		}

		return arrangeSize(chart, x_size, y_size, z_size);
	}


	//--------------------------------------------------------------------
	// create a bar item
	function bar(h, c) { 
		// h: high
		// c: color
		
		var geo = new THREE.CubeGeometry( 1, h, 1 );
		var mat = new THREE.MeshBasicMaterial(
						{ 	color: c, 
							side: THREE.FrontSide,
							opacity: 0.85,
							transparent: true	} );
		var bar = new THREE.Mesh( geo, mat );
		bar.position.y += h / 2;
	
	return bar;
	}


/*********************
	Pie bar
*********************/


	//--------------------------------------------------------------------
	// create pie chart
	function plotPieCh( data ) {
	
		var chart, item, angle, offset, tot;
		
		tot = summation( data );
		offset = 0;
		chart = new THREE.Object3D();
		
		// in each iteration a portion is added
		for (var i=0; i<data.length; i++) {
			angle = 2*Math.PI*data[i] / tot;
			
			item = pie( angle, getColor( i ) );
			
			offset += angle;
			item.rotation.y += offset;
			
			chart.add( item );
		}
		
		return chart;
	}


	//--------------------------------------------------------------------
	// create pie's portion
	function pie( angle, c ) {
		
		var mat = new THREE.MeshBasicMaterial(
						{ 	color: c, 
							side: THREE.FrontSide,
							opacity: 0.85,
							transparent: true	} );
		var geo = new THREE.Geometry();
		
		geo.vertices.push( new THREE.Vector3( 0, 0.5, 0 ) );
		geo.vertices.push( new THREE.Vector3( 0, -0.5, 0 ) );
		
		// vertexes
		var x = 0;
		while (x < angle) {
			geo.vertices.push(
				new THREE.Vector3(
					5*Math.cos( x ), 0.5, 5*Math.sin( x )) );
			geo.vertices.push(
				new THREE.Vector3(
					5*Math.cos( x ), -0.5, 5*Math.sin( x )) );
			x += step;
		}

		geo.vertices.push(
				new THREE.Vector3(
					5*Math.cos( angle ), 0.5, 5*Math.sin( angle )) );

		geo.vertices.push(
				new THREE.Vector3(
					5*Math.cos( angle ), -0.5, 5*Math.sin( angle )) );

		// faces
		var len = geo.vertices.length;
		for (var i=2; i<len-2; i=i+2) {
			geo.faces.push( new THREE.Face3( 0, i+2, i ));
			geo.faces.push( new THREE.Face3( 1, i+1, i+3 ));
			geo.faces.push( new THREE.Face3( i, i+2, i+3 ));
			geo.faces.push( new THREE.Face3( i, i+3, i+1 ));
		}
			
		geo.faces.push( new THREE.Face3( 0, 2, 3 ));
		geo.faces.push( new THREE.Face3( 0, 3, 1 ));
		
		geo.faces.push( new THREE.Face3( 0, 1, len-2 ));
		geo.faces.push( new THREE.Face3( len-2, 1, len-1 ));

		return new THREE.Mesh( geo, mat );
	}


/*********************
	Pie char
*********************/


	//--------------------------------------------------------------------
	// create an area chart
	function plotAreaCh( data, n ) {
		// data: table
		// n: #element for row
		var y_size, z_size, x_size, 
				chart, item, seq;
		
		z_size = (n*2) - 1;
		x_size = (data.length / n) - 1;
		y_size = maximum( data );
		
		// partitioning table in columns
		seq = new Array();
		for (var i=0; i<n; i++) seq[i] = new Array();
		for (var i=0; i<data.length; i++) {
			seq[ i % n ][ div(i, n) ] = data[i];
			}
		
		// build graph
		chart = new THREE.Object3D();
		for (var i=0; i<n; i++) {
			item = area( seq[i], getColor(i) );
			item.position.z += 0.5 + i*2 - (z_size / 2);
			chart.add( item );
			}
			
		return arrangeSize(chart, x_size, y_size, z_size);
	}


	//--------------------------------------------------------------------
	// create area item
	function area( seq, c ) {
	
		var mat = new THREE.MeshBasicMaterial(
						{ 	color: c, 
							side: THREE.FrontSide,
							opacity: 0.85,
							transparent: true	} );
		var geo = new THREE.Geometry();
		
		// vertixes
		for (var i=0; i<seq.length; i++) {
			geo.vertices.push( 
				new THREE.Vector3( i, 0, 0 ) );
			geo.vertices.push( 
				new THREE.Vector3( i, seq[i],  0) );	
			geo.vertices.push( 
				new THREE.Vector3( i, 0,  1) );
			geo.vertices.push( 
				new THREE.Vector3( i, seq[i], 1 ) );
		}
		
		// faces
		len = geo.vertices.length;
		for (var i=0; i<len-4; i+=4) {
			// front side
			geo.faces.push( new THREE.Face3(i, i+1, i+4) );
			geo.faces.push( new THREE.Face3(i+4, i+1, i+5) );
			
			// back side
			geo.faces.push( new THREE.Face3(i+2, i+6, i+3) );
			geo.faces.push( new THREE.Face3(i+3, i+6, i+7) );
		
			// up side
			geo.faces.push( new THREE.Face3(i+1, i+3, i+5) );
			geo.faces.push( new THREE.Face3(i+3, i+7, i+5) );
			
			// down side
			geo.faces.push( new THREE.Face3(i, i+4, i+2) );
			geo.faces.push( new THREE.Face3(i+2, i+4, i+6) );
		}
			
		// left side
		geo.faces.push( new THREE.Face3(1, 0, 2) );
		geo.faces.push( new THREE.Face3(1, 2, 3) );
		
		// right side
		geo.faces.push( new THREE.Face3(len-3, len-1, len-2) );
		geo.faces.push( new THREE.Face3(len-4, len-3, len-2) );
		
		var area = new THREE.Mesh( geo, mat );
		
		// centering
		area.position.x -= (seq.length - 1) / 2;
		area.position.z -= 0.5;
		
		return area;
	}
	
	
/*********************
	Utils
*********************/


	//--------------------------------------------------------------------
	// find over array
	function maximum( array ) {
		var m = 0;
		for (var i=0; i<array.length; i++) m = Math.max(m, array[i]);
		
		return m;
	}
	
	
	//--------------------------------------------------------------------
	// summation over array
	function summation( array ) {
		var x = 0;
		for (var i=0; i<array.length; i++) x += array[i];
		
		return x;
	}
	
	
	//--------------------------------------------------------------------
	// scale object according to constants
	function arrangeSize( obj, x, y, z ) {

		if (y > Y_SIZE) obj.scale.y *= Y_SIZE / y;
		if (x > X_SIZE) obj.scale.x *= X_SIZE / x;	
		if (z > Z_SIZE) obj.scale.z *= Z_SIZE / z;
		
		return obj;
	}
	
	
	//--------------------------------------------------------------------
	// pick a color
	function getColor( i ) { return COLOR[i % 6]; }


	//--------------------------------------------------------------------	
	// create a base for the graph
	function base() {
		var geo = new THREE.CubeGeometry( 11, 0.5, 11 );
		var mat = new THREE.MeshBasicMaterial(
						{ 	color: 0x000000, 
							side: THREE.FrontSide } );
		var base = new THREE.Mesh( geo, mat );
		base.position.y -= 0.26;
	
		return base;
	}

	
	//--------------------------------------------------------------------
	// integer division
	function div(a, b) {
		return Math.floor(a / b);
		}
		
		
/*********************
	Constants
*********************/


	// pie approximation
	var step = 2*Math.PI / 50;
	
	// charts bounding box
	var X_SIZE = 8;
	var Y_SIZE = 5;
	var Z_SIZE = 5;
	
	// colors
	var COLOR = [ 	0xaa0000, 0x00aa00, 0x0000aa,
						0xaaaa00, 0x00aaaa, 0xaa00aa ];	
	

