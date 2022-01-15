# Truffle로 Dapp 만들기

## How to

1. 프로젝트 초기설정

```
$ truffle init
```

2. contracts 폴더에 contract 작성

3. 컴파일

```
$ truffle compile
```

4. migrations 폴더에 migrate를 위한 js 파일 작성
5. truffle-config.js에 network 정보 설정
6. migrate

```
$ truffle migrate
```

7. 확인(스마트 컨트랙트와 상호작용)

```
$ truffle console

$ Lottery.deployed().then(function(instance){ lot=instance })
$ lot.abi
$ lot.owner()
$ lot.getSomeValue()
...
```

## 테스트 하기

test/ 폴더 밑에 test를 위한 js파일 생성

```
$ truffle test
```
