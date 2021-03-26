var debug = false

function create(){
	let container = document.getElementById("container")
	container.innerHTML = ""
	let size = parseInt(document.getElementById("size").value)

	let gridContainer = document.createElement("div")
	gridContainer.id = "gridcontainer"+size

	for(let i = 0; i < size+1; i++){
		for(let j = 0; j < size+1; j++){
			let tmpCell = document.createElement("div")
			if((i == 0 || j == 0) && i != j){
				let tmpInput = document.createElement("textarea")
				tmpCell.appendChild(tmpInput)
			}
			tmpCell.id = "cell_"+(i-1)+"_"+(j-1)
			gridContainer.appendChild(tmpCell)
		}
	}

	container.appendChild(gridContainer)

	let solveBtn = document.createElement("button")
	solveBtn.innerHTML = "Solve"
	solveBtn.onclick = solve

	container.appendChild(solveBtn)
}

function split2array(data, size){
	data = data.split(/\W+/)
	
	let result = []

	let sum = 0
	for(let item of data){
		if(item == ""){
			continue
		}
		let tmpValue = parseInt(item)
		if(isNaN(tmpValue)){
			console.log(item)
			throw "Ein Wert ist keine Zahl"
		}
		if(tmpValue > 0){
			sum += tmpValue
			result.push(tmpValue)
		}
	}
	sum += (result.length - 1)

	if(sum > size){
		throw "Die Werte addieren sich zu mehr als die Breite"
	}

	return result
}


function solve(){
	let size = parseInt(document.getElementById("size").value)

	let columns = []
	let rows = []

	let matrix = []
	for(let i = 0; i < size; i++){
		rows.push(split2array(document.getElementById("cell_"+i+"_-1").firstChild.value, size))
		columns.push(split2array(document.getElementById("cell_-1_"+i).firstChild.value, size))

		matrix[i] = []
		for(let j = 0; j < size; j++){
			matrix[i][j] = ""
		}
	}
	if(!solveIntern(matrix, rows, columns, 0, 0)){
		console.log("Keine Lösung gefunden!")
	}
}

function compareBlocksAndWerte(bloecke, werte, size){
	const bloeckeLength = bloecke.join("").length
	let valid = true
	bloecke = bloecke.join("").split(/\-+/)

	let resultBloecke = []

	for(let tmpBlock of bloecke){
		if(tmpBlock.length > 0){
			resultBloecke.push(tmpBlock.length)
		}
	}

	if(resultBloecke.length > werte.length){
		if(debug){
			console.log("zu viele blöcke in row or column")
		}
		valid = false
	}

	for(let wertIndex in werte){
		if(bloeckeLength != size){
			if(wertIndex >= resultBloecke.length){
				// außerhalb der blöcke
				break
			}else if(wertIndex == resultBloecke.length - 1){
				//letzter block
				if(werte[wertIndex] < resultBloecke[wertIndex]){
					if(debug){
						console.log("letzter block in row or column zu groß")
					}
					valid = false
				}
			}else{
				if(werte[wertIndex] != resultBloecke[wertIndex]){
					if(debug){
						console.log("innerer block in row or column falsch")
					}
					valid = false
				}
			}
		}else{
			//blöcke komplett gefüllt
			if(resultBloecke.length != werte.length){
				valid = false
				break
			}
			if(werte[wertIndex] != resultBloecke[wertIndex]){
				if(debug){
					console.log("innerer block in row or column falsch")
				}
				valid = false
			}
		}
		
	}

	return valid
}

function checkMatrix(matrix, rows, columns){
	let valid = true
	for(let index in matrix){
		let nthRow = matrix[index]
		let nthRowWerte = rows[index]
		let nthColumn = []
		for(let tmpIndex in matrix){
			nthColumn.push(matrix[tmpIndex][index])
		}
		let nthColumnWerte = columns[index]
		if(!compareBlocksAndWerte(nthRow, nthRowWerte, matrix.length)){
			valid = false
		}
		if(!compareBlocksAndWerte(nthColumn, nthColumnWerte, matrix.length)){
			valid = false
		}
	}

	return valid
}

function solveIntern(matrix, rows, columns, i, j){
	if(j == matrix.length){
		console.log("Lösung gefunden!")
		prettyPrintMatrix(matrix)
		return true
	}
	let valid = true

	let copyMatrix = []
	for(let rowIndex in matrix){
		copyMatrix[rowIndex] = []
		for(let columnIndex in matrix){
			copyMatrix[rowIndex][columnIndex] = matrix[rowIndex][columnIndex]
		}
	}

	// test +
	copyMatrix[i][j] = "+"
	if(checkMatrix(copyMatrix, rows, columns)){
		let newI = i+1
		let newJ = j
		if(newI >= matrix.length){
			newI = 0
			newJ += 1
		}
		result = solveIntern(copyMatrix, rows, columns, newI, newJ)

		if(!result){
			valid = false
		}else{
			valid = true
		}
	}else{
		valid = false
	}

	if(!valid){
		// test -
		copyMatrix[i][j] = "-"
		if(checkMatrix(copyMatrix, rows, columns)){
			let newI = i+1
			let newJ = j
			if(newI >= matrix.length){
				newI = 0
				newJ += 1
			}
			result = solveIntern(copyMatrix, rows, columns, newI, newJ)

			if(!result){
				valid = false
			}else{
				valid = true
			}
		}else{
			valid = false
		}
	}

	return valid
}

function prettyPrintMatrix(matrix){
	let result = ""
	for(rowIndex in matrix){
		for(columnIndex in matrix){
			if(matrix[rowIndex][columnIndex] == "+"){
				document.getElementById("cell_"+rowIndex+"_"+columnIndex).classList.add("filled")
			}
			result += matrix[rowIndex][columnIndex]
		}
		result += "\n"
	}
	console.log(result)
}