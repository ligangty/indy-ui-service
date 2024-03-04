/**
 * Copyright (C) 2023 Red Hat, Inc. (https://github.com/Commonjava/indy-ui-service)
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
package org.commonjava.indy.service.ui.jaxrs.auth;

import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.quarkus.test.oidc.server.OidcWiremockTestResource;
import io.quarkus.test.security.TestSecurity;
import io.restassured.path.json.JsonPath;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

@QuarkusTest
@TestProfile( AuthTestProfile.class )
@QuarkusTestResource( OidcWiremockTestResource.class)
public class AuthResourceTest
{
    @TestSecurity( roles = { "power", "admin" }, user = "user" )
    @Test
    public void testGetUserInfo()
    {
        given().when().get( "/api/admin/auth/userinfo" ).then().statusCode( Response.Status.OK.getStatusCode() );
        final JsonPath resultPath = given().get( "/api/admin/auth/userinfo" ).thenReturn().jsonPath();
        assertThat( resultPath.getString( "userName" ), is( "user" ) );
        assertThat( resultPath.getInt( "roles.size" ), is( 2 ) );
        assertThat( resultPath.getList( "roles" ), hasItems( "power", "admin" ) );
    }

}
