import { createUser, deleteUser, getUsers } from "../api";
import DashboardMenu from "../components/DashboardMenu";
import { hideLoading, rerender, showLoading, showMessage } from "../utils";

const UserListScreen = {
    after_render: () => {
        document.getElementById('create-user-button')
            .addEventListener('click', async () => {
                const data = await createUser();
                document.location.hash = `/user/${data.user._id}/edit`;
            });

        const editButtons = document.getElementsByClassName('edit-button');
        Array.from(editButtons).forEach(editButton => {
            editButton.addEventListener('click', () => {
                document.location.hash = `/user/${editButton.id}/edit`;
            });
        });

        const deleteButtons = document.getElementsByClassName('delete-button');
        Array.from(deleteButtons).forEach((deleteButton) => {
            deleteButton.addEventListener('click', async () => {
                if (confirm('Are you sure to delete this user?')) {
                    showLoading();
                    const data = await deleteUser(deleteButton.id);
                    if (data.error) {
                        showMessage(data.error)
                    } else {
                        rerender(UserListScreen);
                    }
                    hideLoading();
                }
            });
        });

    },
    render: async () => {
        const users = await getUsers();
        return `
                <div class="dashboard">
                    ${DashboardMenu.render({ selected: 'users' })}
            <div class="dashboard-content">
                <h1>Users</h1>
                <button id="create-user-button" class="primary">
                    Create User
                </button>
                <div class="user-list">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>PASSWORD</th>
                                <th class="tr-action">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(user => `
                            <tr>
                                <td>${user._id}</td>
                                <td>${user.name}</td>
                                <td>${user.email}</td>
                                <td>${user.password}</td>
                                <td>
                                    <button id="${user._id}" class="edit-button">Edit</button>
                                    <button id="${user._id}" class="delete-button">Delete</button>
                                </td>
                            </tr>
                        `).join('\n')}
                        </tbody>
                    </table>
                </div>
            </div>
            </ >
    `;
    },
};

export default UserListScreen;