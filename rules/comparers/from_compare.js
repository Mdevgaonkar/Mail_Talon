function compare_senders(message_sender, rule_senders) {
    let mssage_senders = rule_senders;
    if (mssage_senders.length > 0) {
        return mssage_senders.indexOf(message_sender);
    }
    return -1;
}

exports.compare_senders = compare_senders;