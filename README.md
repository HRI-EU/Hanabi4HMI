# Hanabi4HMI

Hanabi4HMI is a project to support a user-study where humans have the potential
to go up against/cooperate with another user or an Agent (rulebased or
otherwise).

The implementation is based on
[hanabi-learning-environment](https://github.com/deepmind/hanabi-learning-environment)
and this project implements a simple server-wrapper around it.

The project was developed as a cooperation between the Honda Research Institute
EU and synyx.

[<img height="80px" src="assets/hri.png" alt="HRI-EU Logo"/>](https://honda-ri.de)
[<img height="80px" src="assets/synyx.png" alt="synyx Logo"/>](https://synyx.de)

## Hanabi

Hanabi is a cooperative card game. Therefore, it is suited for experiments
concerning human machine cooperation. Find the instructions and more
information on the game here:

- [Hanabi Game Instructions](https://desktopgames.com.ua/games/909/hanabi_rules_en.pdf)
- [Hanabi Game Official Webpage](https://www.cocktailgames.com/en/game/hanabi/)

## Usage

Install the project and start the server. Then you can access the web-ui in your
browser under: [http://localhost:8000](http://localhost:8000)

Potential starting commands are (obviously not an exhaustive list):

- start hanabi game for **two agents** playing against each other, with one
  being of type `piers` and the other of type `rainbow`.

  ```shell
  hanabi --player-list piers,rainbow --rainbow-type aiide_all1
  ```

- start hanabi game for **two human** players.

  ```shell
  hanabi --player-list human,human
  ```

You can also find more information about potential agents and other options via:

```
hanabi --help
```

## Resources

For implementation of the game we will use the following repositories:

- [hanabi learning environment](https://github.com/deepmind/hanabi-learning-environment)
  - The _hanabi learning environment_ provides an implementation of the hanabi
    game
  - It comes with example agents
- [hanabi ad hoc learning](https://github.com/rocanaan/hanabi-ad-hoc-learning)
  - The _hanabi-ad-hoc-learning_ is an implementation of hanabi which is
    essentially a fork of _hanabi learning environment_
  - It provides a large set of implemented [rule based agents](https://github.com/rocanaan/hanabi-ad-hoc-learning/tree/master/Experiments/Rulebased)
  - It provides a framework to have these agents play against each other and
    shows the achieved results
- [pyhanabi](https://github.com/yawgmoth/pyhanabi)
  - _pyhanabi_ is an example project for a web UI implementation for
    matches between human and machine

## Running Container based

You can also run the application in a container.

We provided the necessary files. The workflow would be:

```shell
$ podman build -t hanabi .
$ podman run -it \
    -v outputs:/outputs \
    -p 8000:8000 \
        hanabi \
            --record-file /outputs/record.csv
```

After running that your sever would be accessible under `localhost:8000` and
your result file would be under `./outputs/record.csv`.

## License

The project is licensed under the BSD 3-clause license - see the [LICENSE](LICENSE)
file for details.

[`src/hanabi/agents/external`](src/hanabi/agents/external) contains code taken
from the mentioned [hanabi-ad-hoc-learning](https://github.com/rocanaan/hanabi-ad-hoc-learning/)
under (`Experiments/Rulebased`). The code is licensed under
[Apache License 2.0](https://github.com/rocanaan/hanabi-ad-hoc-learning/blob/master/LICENSE).
The licenses are also specified in the specific files.
