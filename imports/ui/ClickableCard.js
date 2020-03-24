import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import classNames from 'classnames';

export default class ClickableCard extends React.Component {
	render() {
		const classes = classNames('');
		return (
			<div
				className={classNames('clickable-card', {
					'is-active': this.props.isActive,
					'is-clickable': this.props.isClickable
				})}
				onClick={this.props.isClickable ? this.props.onClick : null}
			>
				<Card isActive={false} suit={this.props.suit} value={this.props.value} type={this.props.type} />
			</div>
		);
	}
}

ClickableCard.propTypes = {
	isActive: PropTypes.bool,
	isClickable: PropTypes.bool,
	suit: PropTypes.string, // "S", "C", "H", "D"
	type: PropTypes.string, // "Standard", "Wizard", "Jester"
	value: PropTypes.number // 1-14, where 11-14 are J,Q,K,A
};
