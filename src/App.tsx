import React from 'react'
import Cells from './Cells'
import game from './Game'
import './App.css'

interface AppProps {}

interface AppState {
  score: number,
  addition: number,
  cells: number[],
  over: boolean,
  won: boolean
}

export default class App extends React.Component<AppProps, AppState> {
  constructor (props: any) {
    super(props)

    game.start()

    this.state = {
      score: 0,
      cells: game.cells,
      over: false,
      won: false,
      addition: 0
    }

    this.handleKeydown = this.handleKeydown.bind(this)
    this.restart = this.restart.bind(this)
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeydown)

    game.addCallback('over', () => {
      this.setState({ over: true })
    })

    game.addCallback('won', () => {
      this.setState({ won: true })
    })

    game.addCallback('addScore', (score: number) => {
      this.setState({ addition:  score })
    })
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeydown)

    game.removeCallback('over')
    game.removeCallback('won')
    game.removeCallback('addScore')
  }

  render () {
    return (
      <div className="app">
        <div className="game-header">
          <h1 className="title">
            2048
          </h1>
          <div className="score-container">
            {this.state.score}

            {
              this.state.addition !== 0 && <div className="score-addition">
                +{this.state.addition}
              </div>
            }
          </div>
        </div>

        <div className="game-intro">
          <button className="restart-button" onClick={this.restart}>Resetar</button>
          <h2 className="subtitle">Comece a jogar!</h2>
          Mova os blocos até alcançar <b>2048!</b>
        </div>

        <div className="game-container">
          {
            (this.state.won || this.state.over) &&
              <div className={`game-message game-${(this.state.won && 'won') || (this.state.over && 'over')}`}>
                <p>
                  {this.state.won ? 'Você ganhou!!! Parabéns!' : 'Você perdeu :('}
                </p>

                <div className='actions'>
                  <button className='retry-button' onClick={this.restart}>Tente de novo!</button>
                </div>
              </div>
          }
          <Cells cells={this.state.cells} />
        </div>

        <p className="game-explanation">
          <b className="important">Como jogar: </b>
          Use as <b>setas do teclado</b> para mover os blocos.  Quando dois blocos do mesmo número encostam, eles se somam!
        </p>
      </div>
    )
  }

  restart (event: any) {
    event.preventDefault()
    game.restart()
    this.setState({
      cells: game.cells,
      addition: 0,
      score: 0,
      over: false,
      won: false
    })
  }

  private handleKeydown (event: any) {
    const keyMap : any = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right'
    }

    if (game.respond(keyMap[event.code])) {
      this.refreshGameState()
    }
  }

  private refreshGameState () : void {
    this.setState({
      cells: game.cells,
      score: game.score,
      over: game.over,
      won: game.won
    })
  }
}
