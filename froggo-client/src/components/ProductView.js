import React from 'react';

class ProductView extends React.Component {
    constructor(props) { 
        super(props);
        this.state = {
            branchList: [],
            imgUrl: null
        };
    }

    async fetchAndDecodeJson(url) {
        const response = await fetch(url);
        return response.json();
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
            branchList: await this.fetchAndDecodeJson('http://localhost:3001/branches')
        });
        const profileData = await this.fetchAndDecodeJson('https://api.github.com/users/mikolajww');
        this.setState({
            imgUrl: profileData['avatar_url']
        });
    }

    async postBranch() {
        const res = await fetch('http://localhost:3001/branches' ,{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"branch_name": Math.random().toString(36).substring(7)})
        });
        return res.json();
    }

    render() {
        return (
            <>  
                <img className="Github-Icon" src={this.state.imgUrl} width="100px" alt=""></img>
                <ul>
                <li>ID | Branch name</li>
                {this.state.branchList.map((b) => {return <li>{b.branch_id} | {b.branch_name}</li>})}
                </ul>
                <button onClick={this.postBranch}>Post</button>
            </>
        );
    }


}
export default ProductView;