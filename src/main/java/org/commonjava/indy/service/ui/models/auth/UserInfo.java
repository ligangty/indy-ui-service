/**
 * Copyright (C) 2024 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.commonjava.indy.service.ui.models.auth;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.Set;

@Schema( description = "The user information. Contains the user name and user roles" )
public class UserInfo
{
    @Schema( description = "User name for current user" )
    private final String userName;

    @Schema( description = "User roles for current user" )
    private final Set<String> roles;

    public UserInfo( String userName, Set<String> roles )
    {
        this.userName = userName;
        this.roles = roles;
    }

    public String getUserName()
    {
        return userName;
    }

    public Set<String> getRoles()
    {
        return roles;
    }
}
