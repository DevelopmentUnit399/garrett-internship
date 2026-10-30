import React, { useState, useEffect } from 'react'

const Countdown = ({ expiryDate }) => {
    const expiryTime = Number(expiryDate)
    const hasExpiry = expiryDate != null && Number.isFinite(expiryTime)
    const [secondsRemaining, setSecondsRemaining] = useState(() =>
        hasExpiry ? Math.max(0, Math.ceil((expiryTime - Date.now()) / 1000)) : 0
    )

    useEffect(() => {
        if (!hasExpiry) {
            setSecondsRemaining(0)
            return
        }

        const getRemainingSeconds = () =>
            Math.max(0, Math.ceil((expiryTime - Date.now()) / 1000));

        setSecondsRemaining(getRemainingSeconds());
        if (expiryTime <= Date.now()) return;

        const intervalId = window.setInterval(() => {
            const remaining = getRemainingSeconds()
            setSecondsRemaining(remaining)
            if (remaining === 0) window.clearInterval(intervalId)
        }, 1000)

        return () => window.clearInterval(intervalId)
    }, [expiryTime, hasExpiry])

    if (!hasExpiry) {
        return <div className="de_countdown">No expiry</div>
    }

    if (secondsRemaining === 0) {
        return <div className="de_countdown">Expired</div>
    }

    const days = Math.floor(secondsRemaining / 86400)
    const hours = Math.floor((secondsRemaining % 86400) / 3600)
    const minutes = Math.floor((secondsRemaining % 3600) / 60)
    const seconds = secondsRemaining % 60
    const countdownText = days > 0
        ? `${days}d ${hours}h ${minutes}m ${seconds}s`
        : `${hours}h ${minutes}m ${seconds}s`

    return <div className="de_countdown">{countdownText}</div>
}

export default Countdown