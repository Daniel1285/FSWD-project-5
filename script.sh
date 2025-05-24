#! /bin/bash

SESH="fswd-5"

tmux has-sesssion -t $SESH 2>/dev/null

if [ $? != 0 ]; then
  tmux new-session -d -s $SESH -n "editor"

  tmux send-keys -t $SESH:editor "cd ~/vim/fullstack/FSWD-project-5" C-m
  tmux send-keys -t $SESH:editor "nvim ." C-m

  tmux new-window -t $SESH -n "server"
  tmux send-keys -t $SESH:server "cd ~/vim/fullstack/FSWD-project-5" C-m
  tmux send-keys -t $SESH:server "npm run dev -- --host" C-m

  tmux new-window -t $SESH -n "db"
  tmux send-keys -t $SESH:db "cd ~/vim/fullstack/FSWD-project-5" C-m
  tmux send-keys -t $SESH:db "npm run json:server -- --port 3001" C-m

  tmux select-window -t $SESH:editor

fi

tmux attach-session -t $SESH
