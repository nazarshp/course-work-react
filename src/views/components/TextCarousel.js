import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from "react-slick";

import './Styles/TextCarousel.css';

class TextCarousel extends Component {

	constructor(props) {
		super(props);
		this.state = {

		}
	}

	render() {

		var items = [];

		var settings = {
			dots: false,
			infinite: false,
			speed: 500,
			vertical: true
		};

		this.props.data.map((item, i) => {

			items.push(
				<div className='carouselItem' 
				key={'ci' + i.toString()}>
				{item}
				</div>
			)
		});

		return (
			<div className='textCarousel'>

			<Slider {...settings}>
				{items}
			</Slider>

			</div>
		)
	}



}


TextCarousel.propTypes = {
	active: PropTypes.number,
	data: PropTypes.array
};

export default TextCarousel;
