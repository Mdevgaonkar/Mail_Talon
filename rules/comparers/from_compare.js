function compare_senders(msg_sender, rule_senders) {
    msg_sender = msg_sender.toLowerCase();
    let message_senders = rule_senders.map(mail_sender => {
        return mail_sender.toLowerCase();
    });
    if (message_senders.length > 0) {
        return message_senders.indexOf(msg_sender);
    }
    return -1;
}

exports.compare_senders = compare_senders;