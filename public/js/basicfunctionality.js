// document.getElementById('update-following').addEventListener('click', async function() {
//     try {
//         const response = await fetch('/getAllUsers');
//         const data = await response.json(); 

//         const followingList = document.querySelector('#following-list-handle-bar .following-list ul');
//         followingList.innerHTML = '';

//         data.forEach(follower => {
//             const li = document.createElement('li');
//             li.textContent = follower.firstName;
//             followingList.appendChild(li);
//         });
//     } catch (error) {
//         console.error('Error:', error);
//     }
// });
// document.getElementById('user-search').addEventListener('input', async function(e) {
//     const searchTerm = e.target.value;
//     const dropdown = document.getElementById('search-dropdown');

//     if (searchTerm.length > 0) {
//       try {
//         const response = await fetch(`/getUsersByPrefix?prefix=${searchTerm}`);
//         const users = await response.json();

//         dropdown.innerHTML = '';
//         dropdown.style.display = 'block'; 

        
//         users.slice(0, 5).forEach(user => {
//           const div = document.createElement('div');
//           div.textContent = user.username;
//           div.onclick = function() {
//             document.getElementById('user-search').value = user.username; 
//             dropdown.style.display = 'none';
//           };
//           dropdown.appendChild(div);
//         });
//       } catch (error) {
//         console.log('Error:', error);
//       }
//     } else {
//       dropdown.style.display = 'none';
//     }
//   });
//     document.getElementById('search-user').addEventListener('click', async function() {
//         const userName = document.getElementById('user-search').value;
    
//         try {
//           const response = await fetch(`/renderUserDetails/${userName}`);
//           const userDetailHtml = await response.text();
    
         
//           document.getElementById('feed-handle-bar').innerHTML = userDetailHtml;
//         } catch (error) {
//           console.error('Error:', error);
//         }
   
//   });
//   document.getElementById('add-following-button').addEventListener('click', async function(event) {
//     event.preventDefault();
    
//     const userId = document.getElementById('user-search').value;

//     try {
//       const response = await fetch(`/renderUserDetails/${userName}`);
//       const userDetailHtml = await response.text();

     
//       document.getElementById('feed-handle-bar').innerHTML = userDetailHtml;
//     } catch (error) {
//       console.error('Error:', error);
//     }
    
// });