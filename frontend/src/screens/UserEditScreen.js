import { getUser, updateUser } from "../api";
import { hideLoading, parseRequestUrl, showLoading, showMessage } from "../utils";

const UserEditScreen = {
    after_render: () => {
        const request = parseRequestUrl();
        document.getElementById('edit-user-form')
            .addEventListener('submit', async (e) => {
                e.preventDefault();
                showLoading();
                const data = await updateUser({
                    _id: request.id,
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                });
                hideLoading();
                if (data.error) {
                    showMessage(data.error);
                } else {
                    document.location.hash = '/userslist';
                }
            });
    },
    render: async () => {
        const request = parseRequestUrl();
        console.log(request);
        const user = await getUser(request.id);
        console.log(user);
        return `
        <div class="content">
            <div>
                <a href="/#/userslist">Back to users</a>
            </div>
             <div class="form-container">
                <form id="edit-user-form">
                    <ul class="form-items">
                        <li>
                            <h1>Create User ${user._id.substring(0, 8)}</h1>
                        </li>
                        <li>
                            <label for="name">Name</label>
                            <input type="text" name="name" id="name" value="${user.name}"/>
                        </li>
                        <li>
                            <label for="email">Email</label>
                            <input type="text" name="email" id="email"  value="${user.email}" />
                        </li>
                        <li>
                            <label for="password">Password</label>
                            <input type="text" name="password" id="password" value="${user.password}" />
                        </li>
                        <li>
                            <button type="submit" class="primary">Update</button>
                        </li>
                    </ul>
                </form>
             </div>
        </div>
        `;
    },
};

export default UserEditScreen;