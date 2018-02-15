pragma solidity ^0.4.18;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}

/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Pausable is Ownable {
  event Pause();
  event Unpause();

  bool public paused = false;


  /**
   * @dev Modifier to make a function callable only when the contract is not paused.
   */
  modifier whenNotPaused() {
    require(!paused);
    _;
  }

  /**
   * @dev Modifier to make a function callable only when the contract is paused.
   */
  modifier whenPaused() {
    require(paused);
    _;
  }

  /**
   * @dev called by the owner to pause, triggers stopped state
   */
  function pause() onlyOwner whenNotPaused public {
    paused = true;
    Pause();
  }

  /**
   * @dev called by the owner to unpause, returns to normal state
   */
  function unpause() onlyOwner whenPaused public {
    paused = false;
    Unpause();
  }
}

contract LotteryFactory is Pausable {
    
    event CreateLottery(uint amountPerPlayer, uint minimumPlayers, address creator);
    
    struct LotteriesStats {
        uint totalAmount;
        uint totalPlayers;
    }
    
    address[] public lotteries;

    LotteriesStats public lotteriesStats;

    function createLottery(uint amountPerPlayer, uint minimumPlayers) public whenNotPaused  {
        address lottery = new Lottery(amountPerPlayer, minimumPlayers, msg.sender);
        lotteries.push(lottery);
        lotteriesStats.totalAmount += amountPerPlayer;
        lotteriesStats.totalPlayers += minimumPlayers;
        CreateLottery(amountPerPlayer, minimumPlayers, msg.sender);
    }
    
    function getLotteries () public view returns (address[]) {
        return lotteries;
    }
    
    function getLotteriesCount() public view returns(uint) {
        return lotteries.length;
    }
    
    function getLotteriesStats() public view returns(uint, uint, address[]) {
        return (
            lotteriesStats.totalAmount,
            lotteriesStats.totalPlayers,
            lotteries
        );
    }
}

contract Lottery is Pausable {
    
    event Enter(uint amount, address player);
    event PickWinner(uint winnerAmount, address winner);
    
    /** Amount per player in wei.*/
    uint public amountPerPlayer;
    uint public minimumPlayers;

    address[] public players;
    address public manager;
    
    address public winner;
    uint public winnerAmount;
    
    function Lottery(uint _amountPerPlayer, uint _minimumPlayers, address owner) public whenNotPaused {
        require(_minimumPlayers > 1);
        require(_amountPerPlayer > 0);
        amountPerPlayer = _amountPerPlayer;
        minimumPlayers = _minimumPlayers;
        manager = owner;
    }

    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }
  
    function getSummary() public view returns (uint, uint, uint, address, address, address, address[], bool) {
        return (amountPerPlayer, minimumPlayers, winnerAmount, winner, manager, owner, players, paused);
    }

    function enter() public payable whenNotPaused {
        require(msg.value == amountPerPlayer);
        players.push(msg.sender);
        Enter(amountPerPlayer, msg.sender);
    }
    
    function random() private view returns (uint) {
        // Don't use this implementation in production environment. It is only for educational purposes.
        return uint(keccak256(block.difficulty, now, players, owner, amountPerPlayer));
    }
    
    function pickWinner() public onlyManager whenNotPaused {
        require(players.length >= minimumPlayers);//At least minimumPlayers.
        require(winner == address(0x0));//Winner must not be selected.
        
        uint index = random() % players.length;
        winner = players[index];
        winnerAmount = this.balance;
        winner.transfer(this.balance);
        PickWinner(winnerAmount, winner);
    }
    
    function getBalance() public view returns (uint) {
        return this.balance;
    }

    function getPlayers() public view returns (address[]){
        return players;
    }   
}