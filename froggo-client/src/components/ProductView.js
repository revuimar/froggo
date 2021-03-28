import React from 'react';

class ProductView extends React.Component {
    constructor(props) { 
        super(props);
        this.state = {
            branchList: [],
            imgUrl: null
        };
    }

    async fetchGithubApi(url) {
        const response = await fetch(url);
        return await response.json();
    }

    generateRandomBranches(length) {
        return [...Array(length).keys()]
            .map((idx) => {return {
                "branch_id": idx, 
                "branch_name": Math.random().toString(36).substring(7)
            }; 
        });
    }
  
    async componentDidMount() {
        // const githubRepos = await this.fetchGithubApi('https://api.github.com/users/mikolajww/repos')
        this.setState({
            branchList: this.generateRandomBranches(20)
        });
        const profileData = await this.fetchGithubApi('https://api.github.com/users/mikolajww');
        this.setState({
            imgUrl: profileData['avatar_url']
        });
    }

    render() {
        return (
            <>  
                <img className="Github-Icon" src={this.state.imgUrl} width="100px" alt=""></img>
                <ul>
                <li>ID | Branch name</li>
                {this.state.branchList.map((b) => {return <li>{b.branch_id} | {b.branch_name}</li>})}
                </ul>
            </>
        );
    }


}
export default ProductView;