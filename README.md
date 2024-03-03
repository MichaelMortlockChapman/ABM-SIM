# ABM-SIM
A basic agent-based model simulation implmentation for a one item market.

Contains two prototypes, one C# and one Javascript. Started the C# prototype first with the idea to be able to port it into a Godot project however moved to javascript to make the prototype/display easier and faster.

## Javascript Prototype
Originally aimed to implment the model from  "A simple learning agent interacting with an agent-based market model" (https://www.sciencedirect.com/science/article/pii/S0378437123009184), however ran into issues implmenting it. For now the model is a simple ABM very very loosely based on the paper.

3 Agent types at the moment.
  - Dense Neural Net Agent: Originally going for an agent with reinforcement learning as a backbone but moved towards a NN that tries to learn when to buy/sell (very very naive implmentation).
  - Random Fundamental Provider: Randomly chooses to either sell or buy with a price close to a constant (fundamental price).
  - Random Provider: Like RFP but price is around the current mid-price.

The model also includes 3 main constants
- Starting Price: The price the stock/item starts at.
- Agent Starting Volume: The volume of stock the agents start with.
- Agent Starting Capital: The captial the agetns start with. Only non-provider agents utilise this.

### Things to improve
- Fix known bug where sim throws the error "Error: Unable to create WebGLTexture." after a while, likely due to a memory leak.
- Completly rework Dense NN Agent for a RL agent.
- Create agents that relate closer to the paper.
- Make charts "realtime" instead of taking the last 100* sim steps.

### How to Run
```
cd abm-sim-js
npm i
npm start
```