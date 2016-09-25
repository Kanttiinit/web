import React from 'react'

const ShareModal = ({restaurant}) => {
  const imageUrl = `https://kitchen.kanttiinit.fi/restaurants/${restaurant.id}/menu.png`
  return (
    <div style={{background: 'white', padding: '1rem'}}>
      <h1>Share</h1>
      <img src={imageUrl} />
      <input onFocus={e => e.target.select()} defaultValue={imageUrl} />
    </div>
  );
}

export default ShareModal
