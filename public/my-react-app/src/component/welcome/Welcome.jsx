import './welcome.css';

const Welcome = ({onClick}) => {

    return (
        <section className="welcome-container" onClick={onClick}>
            <h1>Welcome!</h1>
            <p>Click Anywhere to Continue</p>
        </section>
    
    );

};

export default Welcome