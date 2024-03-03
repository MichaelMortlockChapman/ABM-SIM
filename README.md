# ABM-SIM
A basic agent-based model simulation implementation for a one item market.

Contains two prototypes, one C# and one JavaScript. Started the C# prototype first with the idea to be able to port it into a Godot project however moved to JavaScript to make the prototype/display easier and faster.

## JavaScript Prototype
Originally aimed to implement the model from  "A simple learning agent interacting with an agent-based market model" (https://www.sciencedirect.com/science/article/pii/S0378437123009184), however ran into issues implementing it. For now, the model is a simple ABM very very loosely based on the paper.

Three Agent types at the moment.
  - Dense Neural Net Agent: Originally going for an agent with reinforcement learning as a backbone but moved towards a NN that tries to learn when to buy/sell (very very naive implementation).
  - Random Fundamental Provider: Randomly chooses to either sell or buy with a price close to a constant (fundamental price).
  - Random Provider: Like RFP but 'constant' is the current mid-price.

The model also includes three main simulation constants.
- Starting Price: The price the stock/item starts at.
- Agent Starting Volume: The volume of stock the agents start with.
- Agent Starting Capital: The capital the agents start with. Only non-provider agents utilise this.

### Things to improve
- Fix known bug where sim throws the error "Error: Unable to create WebGLTexture" after a while, likely due to a memory leak.
- Completely rework Dense NN Agent for a RL agent.
- Create agents that relate closer to the paper.
- Make charts "realtime" instead of taking the last 100* sim steps.

### How to Run
```
cd abm-sim-js
npm i
npm start
```