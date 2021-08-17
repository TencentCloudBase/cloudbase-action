#!/usr/bin/env bash

SECRET_ID="$1"
SECRET_KEY="$2"
ENV_ID="$3"
CONFIG_FILE="./cloudbaserc.json"

#
# Must Required variables check
#
if [ -z "$SECRET_ID" ] || [ -z "$SECRET_KEY" ] || [ -z "$ENV_ID" ]; then
    echo "::error:: Missing required parameters"
    exit 1
fi

#
# Config file check
#
if [ ! -f "$CONFIG_FILE" ]; then
    echo "::error:: Missing cloudbase configuration file"
    exit 1
fi

#
# Trace commands, print tips & description
# @param command The actual command to execute
# @param description Describe the purpose of the command, with ansi color
#
trace() {
    # Group inner steps
    echo -e "::group::$2"
    echo -e "\e[32m› $1"
    eval "$1"
    ERROR_CODE=$?
    if [[ $ERROR_CODE -ne 0 ]]; then
        exit $ERROR_CODE
    fi
    echo "::endgroup::"
}

trace "sudo npm install -g @cloudbase/cli --loglevel=error" "\e[34mDownload and install cloudbase cli"

trace "tcb login --apiKeyId "$SECRET_ID" --apiKey "$SECRET_KEY"" "\e[34mLogin to cloudbase"

trace "tcb framework deploy -e "$ENV_ID"" "\e[36mDeploy to cloudbase"
