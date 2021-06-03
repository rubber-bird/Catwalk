// Imports
import ReactDOM from 'react-dom'
import React from 'react'

// Styles
import AppStyle from '../styles/app.css'


/* ** IMPORT COMPONENT FILES ** */
import RelatedProduct from './RelatedProduct.jsx';

import Overview from './Overview.jsx'

class App extends React.Component {
	constructor (props) {
		super(props)
	}
	render () {
		return (
			<div>


				<h1 className={AppStyle.testClass}>CATWALK</h1>
				<Overview/>
				<RelatedProduct /*props={this.state}*/ />
			</div>

		);
	}
}

export default App