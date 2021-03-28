import React from 'react';

class ProductView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {repoList: []};
    }
  
    async componentDidMount() {
        const apiUrl = 'https://api.github.com/users/mikolajww/repos';
        const response = await fetch(apiUrl);
        const responseData = await response.json();
        responseData.forEach(element => {
            console.log(element.name);
            this.setState({
                repoList: [...this.state.repoList, element.name]
            });
        });
    }

    render() {
        return (
            <ul>
            {this.state.repoList.map((el) => {return <li>{el}</li>})}
            </ul>
        );
    }
}
export default ProductView;